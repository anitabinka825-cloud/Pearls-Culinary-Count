import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb, withTx } from '../db.js';
import { requireAuth } from '../auth.js';
import { notifyOrderEvent } from '../notify.js';
import { getPaystack, paystackConfigured, secretKey, PaystackError, VerifiedTransaction } from '../paystack.js';

export const paymentsRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment attempts. Please try again shortly.' },
});

const appUrl = (req: Request) => (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
const attemptRef = (orderRef: string) => `${orderRef}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

async function ownedOrder(req: Request, reference: string) {
  const { rows } = await getDb().query('SELECT * FROM orders WHERE reference=$1', [reference]);
  const o = rows[0];
  return o && o.customer_id === req.user!.id ? o : null;
}

/**
 * Turns a Paystack verification into our records. The ONLY place an order becomes paid.
 * Safe to call repeatedly (verify endpoint, webhook, retries): every state change is a
 * conditional UPDATE, so a payment can settle an order at most once.
 */
export async function settlePayment(payment: any, v: VerifiedTransaction): Promise<'paid' | 'failed' | 'pending'> {
  if (v.status === 'success') {
    // Never trust the amount/currency we were *told* — compare with what we asked Paystack to charge.
    if (v.reference !== payment.reference || v.currency !== payment.currency || v.amountPesewas !== payment.amount_pesewas) {
      console.error('Paystack mismatch', { ref: payment.reference, got: v, expected: payment.amount_pesewas });
      await getDb().query(
        `UPDATE payments SET status='failed', note='amount_or_currency_mismatch' WHERE id=$1 AND status='pending'`,
        [payment.id],
      );
      return 'failed';
    }
    let credited = false;
    const result = await withTx<'paid' | 'failed' | 'pending'>(async (tx) => {
      const claimed = await tx.query(
        // 'failed'/'abandoned' are not final at Paystack (the customer can retry on the same checkout
        // link), so a later success must still be credited. Only 'success' is terminal here.
        `UPDATE payments SET status='success', channel=$2, paid_at=now() WHERE id=$1 AND status<>'success' RETURNING id`,
        [payment.id, v.channel],
      );
      if (!claimed.rows[0]) return 'paid'; // already settled earlier — idempotent
      const order = await tx.query(
        `UPDATE orders SET payment_status='paid', status='paid', updated_at=now()
         WHERE id=$1 AND payment_status='unpaid' RETURNING id`,
        [payment.order_id],
      );
      if (!order.rows[0]) {
        // Customer paid twice (e.g. two open attempts). Order stays paid once; flag the extra for refund.
        await tx.query(`UPDATE payments SET note='duplicate_payment_needs_refund' WHERE id=$1`, [payment.id]);
        console.warn('Duplicate payment needs refund', payment.reference);
      } else {
        credited = true;
      }
      return 'paid';
    });
    // After the transaction has committed: tell the customer (and owner) once. SMS can never fail a payment.
    if (credited) notifyOrderEvent(payment.order_id, 'paid');
    return result;
  }
  if (v.status === 'failed' || v.status === 'abandoned' || v.status === 'reversed') {
    await getDb().query(`UPDATE payments SET status='failed' WHERE id=$1 AND status='pending'`, [payment.id]);
    return 'failed';
  }
  return 'pending'; // ongoing / pending / processing / queued (e.g. mobile-money prompt not yet approved)
}

// Start a payment. Amount, currency and customer email come from OUR database, never the browser.
paymentsRouter.post('/:reference/pay', requireAuth, limiter, async (req, res) => {
  if (!paystackConfigured()) return res.status(503).json({ error: 'Online payment is not available right now.' });
  const order = await ownedOrder(req, String(req.params.reference));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status === 'cancelled') return res.status(409).json({ error: 'This order was cancelled.' });
  if (order.payment_status !== 'unpaid') return res.status(409).json({ error: 'This order is already paid.' });
  if (!order.customer_email) return res.status(400).json({ error: 'An email address is required to pay.' });

  const reference = attemptRef(order.reference);
  try {
    const init = await getPaystack().initialize({
      email: order.customer_email,
      amountPesewas: order.total_pesewas,
      reference,
      callbackUrl: `${appUrl(req)}/order/${order.reference}`,
      metadata: { order_reference: order.reference },
    });
    await getDb().query(
      'INSERT INTO payments (order_id, reference, amount_pesewas, currency) VALUES ($1,$2,$3,$4)',
      [order.id, reference, order.total_pesewas, 'GHS'],
    );
    res.json({ authorizationUrl: init.authorizationUrl });
  } catch (e) {
    console.error('Paystack initialize failed:', e instanceof Error ? e.message : e);
    res.status(502).json({ error: 'We could not start the payment. Please try again in a moment.' });
  }
});

// Called when the customer returns from Paystack. Asks Paystack directly — the URL is not trusted.
paymentsRouter.post('/:reference/verify', requireAuth, limiter, async (req, res) => {
  const order = await ownedOrder(req, String(req.params.reference));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.payment_status === 'paid') return res.json({ paymentStatus: 'paid' });
  const { rows } = await getDb().query(
    `SELECT * FROM payments WHERE order_id=$1 AND status<>'success' ORDER BY id DESC LIMIT 5`,
    [order.id],
  );
  let paid = false;
  let pending = false;
  try {
    for (const p of rows) {
      const r = await settlePayment(p, await getPaystack().verify(p.reference));
      if (r === 'paid') { paid = true; break; }
      if (r === 'pending') pending = true;
    }
  } catch (e) {
    console.error('Paystack verify failed:', e instanceof Error ? e.message : e);
    return res.status(502).json({ error: 'We could not confirm your payment yet. Please refresh in a moment.' });
  }
  const result = paid ? 'paid' : pending ? 'pending' : 'failed';
  res.json({ paymentStatus: result });
});

/** Mounted with express.raw() BEFORE the JSON parser: the signature covers the exact raw bytes. */
export async function paystackWebhook(req: Request, res: Response) {
  const key = secretKey();
  const raw: Buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from('');
  const sent = String(req.headers['x-paystack-signature'] || '');
  const expected = crypto.createHmac('sha512', key).update(raw).digest('hex');
  const a = Buffer.from(sent), b = Buffer.from(expected);
  if (!key || a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).end();

  try {
    const event = JSON.parse(raw.toString('utf8'));
    if (event?.event === 'charge.success' && event.data?.reference) {
      const { rows } = await getDb().query('SELECT * FROM payments WHERE reference=$1', [String(event.data.reference)]);
      // Don't act on the webhook body itself: confirm with Paystack, then settle.
      if (rows[0]) await settlePayment(rows[0], await getPaystack().verify(rows[0].reference));
    }
  } catch (e) {
    console.error('Webhook processing failed:', e instanceof Error ? e.message : e);
    return res.status(500).end(); // non-2xx makes Paystack retry
  }
  res.status(200).end();
}
