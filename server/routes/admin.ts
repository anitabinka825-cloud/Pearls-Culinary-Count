import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';
import { toOrder } from './orders.js';
import { notifyOrderEvent, resendSms } from '../notify.js';
import { getSmsTransport } from '../sailup.js';

/** Dashboard-only endpoints. Enquiries and delivery areas keep their own admin routers. */
export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

export const ORDER_STATUSES = [
  'pending_payment', 'paid', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
const ACTIVE: OrderStatus[] = ['paid', 'preparing', 'ready', 'out_for_delivery'];

/**
 * Allowed moves. Nothing can be set to `paid` by hand — only a verified Paystack payment does that
 * (see settlePayment). Completed and cancelled are final.
 */
export const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['cancelled'],
  paid: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const FLAG_DUPLICATE = 'duplicate_payment_needs_refund';

const toAdminOrder = (r: any, items: any[] = [], payments: any[] = []) => ({
  ...toOrder(r, items),
  customerEmail: r.customer_email,
  updatedAt: r.updated_at,
  needsRefund: r.status === 'cancelled' && r.payment_status === 'paid',
  nextStatuses: NEXT_STATUS[r.status as OrderStatus].filter(
    (s) => !(s === 'out_for_delivery' && r.fulfilment !== 'delivery'),
  ),
  payments: payments.map((p) => ({
    id: p.id,
    reference: p.reference,
    amountPesewas: p.amount_pesewas,
    status: p.status,
    channel: p.channel,
    note: p.note,
    createdAt: p.created_at,
    paidAt: p.paid_at,
  })),
});

adminRouter.get('/summary', async (_req, res) => {
  const db = getDb();
  const since = new Date(Date.now() - 30 * 864e5);
  const [byStatus, revenue, enquiries, dupes, cancelledPaid] = await Promise.all([
    db.query('SELECT status, COUNT(*) AS n FROM orders GROUP BY status'),
    db.query(
      `SELECT COALESCE(SUM(total_pesewas),0) AS s, COUNT(*) AS n FROM orders
       WHERE payment_status='paid' AND status<>'cancelled' AND created_at >= $1`,
      [since],
    ),
    db.query(`SELECT COUNT(*) AS n FROM enquiries WHERE status='new'`),
    db.query(`SELECT COUNT(*) AS n FROM payments WHERE note=$1`, [FLAG_DUPLICATE]),
    db.query(`SELECT COUNT(*) AS n FROM orders WHERE status='cancelled' AND payment_status='paid'`),
  ]);
  const orders: Record<string, number> = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]));
  for (const r of byStatus.rows) orders[r.status] = Number(r.n);
  res.json({
    orders,
    activeOrders: ACTIVE.reduce((n, s) => n + orders[s], 0),
    last30Days: { paidOrders: Number(revenue.rows[0].n), revenuePesewas: Number(revenue.rows[0].s) },
    newEnquiries: Number(enquiries.rows[0].n),
    refundsToProcess: Number(dupes.rows[0].n) + Number(cancelledPaid.rows[0].n),
  });
});

adminRouter.get('/orders', async (req, res) => {
  const status = String(req.query.status || '');
  const q = String(req.query.q || '').trim().toLowerCase().slice(0, 60);
  const where: string[] = [];
  const params: unknown[] = [];
  if (status === 'active') where.push(`status IN (${ACTIVE.map((s) => `'${s}'`).join(',')})`);
  else if ((ORDER_STATUSES as readonly string[]).includes(status)) {
    params.push(status);
    where.push(`status=$${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    const n = params.length;
    where.push(
      `(lower(reference) LIKE $${n} OR lower(customer_name) LIKE $${n} OR lower(customer_phone) LIKE $${n})`,
    );
  }
  // Active orders are worked in the order they are due; everything else newest first.
  const order = status === 'active' ? 'preferred_date ASC, created_at ASC' : 'created_at DESC';
  const { rows } = await getDb().query(
    `SELECT * FROM orders ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${order} LIMIT 300`,
    params,
  );
  res.json(rows.map((r) => toAdminOrder(r)));
});

adminRouter.get('/orders/:reference', async (req, res) => {
  const db = getDb();
  const { rows } = await db.query('SELECT * FROM orders WHERE reference=$1', [req.params.reference]);
  const o = rows[0];
  if (!o) return res.status(404).json({ error: 'Order not found' });
  const [items, payments] = await Promise.all([
    db.query('SELECT * FROM order_items WHERE order_id=$1 ORDER BY id', [o.id]),
    db.query('SELECT * FROM payments WHERE order_id=$1 ORDER BY id', [o.id]),
  ]);
  res.json(toAdminOrder(o, items.rows, payments.rows));
});

const orderUpdate = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    // The only manual payment change: record that a cancelled, paid order has been refunded in Paystack.
    paymentStatus: z.literal('refunded').optional(),
  })
  .refine((v) => v.status || v.paymentStatus, 'Nothing to update');

adminRouter.patch('/orders/:reference', async (req, res) => {
  const parsed = orderUpdate.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const db = getDb();
  const { rows } = await db.query('SELECT * FROM orders WHERE reference=$1', [req.params.reference]);
  const o = rows[0];
  if (!o) return res.status(404).json({ error: 'Order not found' });
  const { status, paymentStatus } = parsed.data;

  if (status) {
    const allowed = toAdminOrder(o).nextStatuses;
    if (!allowed.includes(status)) {
      return res.status(409).json({ error: `An order that is ${o.status.replace(/_/g, ' ')} cannot be moved to ${status.replace(/_/g, ' ')}.` });
    }
    // Cancelling an unpaid order also closes it to payment: if the customer still has a Paystack
    // window open and pays later, settlePayment sees a non-'unpaid' order and flags the money for
    // refund instead of reviving the order.
    const closePayment = status === 'cancelled' && o.payment_status === 'unpaid';
    const moved = await db.query(
      `UPDATE orders SET status=$1, payment_status=CASE WHEN $4 THEN 'failed' ELSE payment_status END,
         updated_at=now() WHERE id=$2 AND status=$3 RETURNING *`,
      [status, o.id, o.status, closePayment],
    );
    if (!moved.rows[0]) return res.status(409).json({ error: 'This order was just changed by someone else. Reload and try again.' });
    Object.assign(o, moved.rows[0]);
    if (status === 'ready' || status === 'out_for_delivery' || status === 'cancelled') notifyOrderEvent(o.id, status);
  }

  if (paymentStatus) {
    if (o.status !== 'cancelled' || o.payment_status !== 'paid') {
      return res.status(409).json({ error: 'Only a cancelled, paid order can be marked as refunded.' });
    }
    const r = await db.query(
      `UPDATE orders SET payment_status='refunded', updated_at=now()
       WHERE id=$1 AND status='cancelled' AND payment_status='paid' RETURNING *`,
      [o.id],
    );
    if (!r.rows[0]) return res.status(409).json({ error: 'This order was just changed. Reload and try again.' });
    Object.assign(o, r.rows[0]);
    notifyOrderEvent(o.id, 'refunded');
  }

  const [items, payments] = await Promise.all([
    db.query('SELECT * FROM order_items WHERE order_id=$1 ORDER BY id', [o.id]),
    db.query('SELECT * FROM payments WHERE order_id=$1 ORDER BY id', [o.id]),
  ]);
  res.json(toAdminOrder(o, items.rows, payments.rows));
});

// Customers who paid twice: list the extra payments and let the owner tick them off once refunded.
adminRouter.get('/payments/flagged', async (_req, res) => {
  const { rows } = await getDb().query(
    `SELECT p.*, o.reference AS order_reference, o.customer_name, o.customer_phone
     FROM payments p JOIN orders o ON o.id = p.order_id
     WHERE p.note=$1 ORDER BY p.paid_at DESC`,
    [FLAG_DUPLICATE],
  );
  res.json(
    rows.map((p) => ({
      id: p.id,
      reference: p.reference,
      orderReference: p.order_reference,
      customerName: p.customer_name,
      customerPhone: p.customer_phone,
      amountPesewas: p.amount_pesewas,
      paidAt: p.paid_at,
    })),
  );
});

adminRouter.post('/payments/:id/refunded', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid request' });
  const { rows } = await getDb().query(
    `UPDATE payments SET note='duplicate_refunded' WHERE id=$1 AND note=$2 RETURNING id`,
    [id, FLAG_DUPLICATE],
  );
  if (!rows[0]) return res.status(404).json({ error: 'No refund is pending for that payment' });
  res.json({ ok: true });
});

// ---- SMS (Stage 8) ----
adminRouter.get('/sms', async (_req, res) => {
  const { rows } = await getDb().query('SELECT * FROM sms_log ORDER BY id DESC LIMIT 100');
  res.json(
    rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      audience: r.audience,
      recipient: r.recipient,
      body: r.body,
      orderReference: r.order_reference,
      enquiryReference: r.enquiry_reference,
      state: r.state,
      deliveryStatus: r.delivery_status,
      error: r.error,
      createdAt: r.created_at,
    })),
  );
});

adminRouter.get('/sms/credits', async (_req, res) => {
  const t = getSmsTransport();
  if (!t) return res.json({ configured: false });
  try {
    res.json({ configured: true, ...(await t.credits()) });
  } catch (e) {
    res.json({ configured: true, error: e instanceof Error ? e.message : 'Could not check credits' });
  }
});

adminRouter.post('/sms/:id/resend', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid request' });
  if (!(await resendSms(id))) return res.status(409).json({ error: 'Only messages that failed or were not sent can be resent.' });
  const { rows } = await getDb().query('SELECT state, error FROM sms_log WHERE id=$1', [id]);
  res.json({ state: rows[0].state, error: rows[0].error });
});
