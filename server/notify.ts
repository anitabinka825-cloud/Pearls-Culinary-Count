import { getDb } from './db.js';
import { getSmsTransport, toGsm } from './sailup.js';
import { normalizeGhanaPhone } from './validation.js';
import { getSiteSettings } from './settings.js';
import { BUSINESS_CONFIG } from '../src/config/business.js';

/**
 * SMS notifications. Design rules:
 *  - Never throw into the caller: an SMS problem must not fail a payment, order or enquiry.
 *  - At most once per event: dedupe_key is UNIQUE, so retries and duplicate webhooks send nothing extra.
 *  - Customer messages are transactional (they follow something the customer just did).
 *  - Every attempt, including "not configured", is logged so the owner can see and resend.
 */

const pending = new Set<Promise<unknown>>();
/** Runs a notification in the background but lets tests (and shutdown) wait for it. */
function background(p: Promise<unknown>) {
  const t = p.catch((e) => console.error('SMS notification error:', e instanceof Error ? e.message : e));
  pending.add(t);
  t.finally(() => pending.delete(t));
}
export async function notificationsIdle() {
  while (pending.size) await Promise.all([...pending]);
}

const ghs = (pesewas: number) => `GHS ${(pesewas / 100).toFixed(2)}`;
const biz = BUSINESS_CONFIG.shortName;
/** Owner alert number: the dashboard setting wins; SMS_OWNER_PHONE is the fallback. */
const ownerPhone = async () =>
  (await getSiteSettings()).ownerAlertPhone || normalizeGhanaPhone(process.env.SMS_OWNER_PHONE || '') || '';

interface Outgoing {
  key: string;
  kind: string;
  audience: 'customer' | 'owner';
  to: string;
  body: string;
  orderRef?: string;
  enquiryRef?: string;
}

async function attempt(id: number, to: string, body: string) {
  const db = getDb();
  const t = getSmsTransport();
  if (!t) {
    await db.query(`UPDATE sms_log SET state='skipped', error=$2, updated_at=now() WHERE id=$1`, [id, 'SMS is not set up yet (no SAILUP_API_KEY)']);
    return;
  }
  try {
    const r = await t.send(to, body);
    await db.query(`UPDATE sms_log SET state='sent', provider_id=$2, error='', updated_at=now() WHERE id=$1`, [id, r.id]);
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).slice(0, 300);
    console.error('SMS send failed:', msg);
    await db.query(`UPDATE sms_log SET state='failed', error=$2, updated_at=now() WHERE id=$1`, [id, msg]);
  }
}

async function deliver(m: Outgoing) {
  if (!m.to) return;
  const { rows } = await getDb().query(
    `INSERT INTO sms_log (dedupe_key, kind, audience, recipient, body, order_reference, enquiry_reference)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (dedupe_key) DO NOTHING RETURNING id`,
    [m.key, m.kind, m.audience, m.to, toGsm(m.body), m.orderRef ?? '', m.enquiryRef ?? ''],
  );
  if (!rows[0]) return; // already sent (or already being sent) for this event
  const saved = await getDb().query('SELECT body FROM sms_log WHERE id=$1', [rows[0].id]);
  await attempt(rows[0].id, m.to, saved.rows[0].body);
}

/** Re-sends a failed or skipped message (admin "Resend"). Claims the row first so double-clicks send once. */
export async function resendSms(id: number): Promise<boolean> {
  const { rows } = await getDb().query(
    `UPDATE sms_log SET state='pending', error='', updated_at=now()
     WHERE id=$1 AND state IN ('failed','skipped') RETURNING id, recipient, body`,
    [id],
  );
  if (!rows[0]) return false;
  await attempt(rows[0].id, rows[0].recipient, rows[0].body);
  return true;
}

async function loadOrder(orderId: number) {
  const { rows } = await getDb().query('SELECT * FROM orders WHERE id=$1', [orderId]);
  return rows[0];
}

export type OrderEvent = 'paid' | 'ready' | 'out_for_delivery' | 'cancelled' | 'refunded';

async function sendOrderEvent(orderId: number, event: OrderEvent) {
  const o = await loadOrder(orderId);
  if (!o) return;
  const ref = o.reference as string;
  const phone = (await getSiteSettings()).phone || BUSINESS_CONFIG.phone; // as shown to customers
  const key = (suffix: string) => `${suffix}:${ref}:${event}`;
  const customer = (kind: string, body: string) =>
    deliver({ key: key('order'), kind, audience: 'customer', to: o.customer_phone, body, orderRef: ref });

  switch (event) {
    case 'paid':
      await customer('order_paid', `${biz}: Payment of ${ghs(o.total_pesewas)} received for order ${ref}. We will prepare it for ${o.preferred_date}. Thank you!`);
      await deliver({
        key: key('owner'), kind: 'owner_new_order', audience: 'owner', to: await ownerPhone(), orderRef: ref,
        body: `New paid order ${ref}: ${ghs(o.total_pesewas)}, ${o.fulfilment === 'delivery' ? `deliver to ${o.zone_name}` : 'pickup'} on ${o.preferred_date}. ${o.customer_name} ${o.customer_phone}`,
      });
      break;
    case 'ready':
      await customer('order_ready', o.fulfilment === 'delivery'
        ? `${biz}: Your order ${ref} is ready and will be on its way shortly.`
        : `${biz}: Your order ${ref} is ready for pickup. Call ${phone} for directions.`);
      break;
    case 'out_for_delivery':
      await customer('order_out', `${biz}: Your order ${ref} is out for delivery to ${o.zone_name}. Please keep your phone close.`);
      break;
    case 'cancelled':
      // Unpaid orders were never charged, so there is nothing useful to tell the customer.
      if (o.payment_status === 'paid' || o.payment_status === 'refunded')
        await customer('order_cancelled', `${biz}: Order ${ref} has been cancelled. Your payment of ${ghs(o.total_pesewas)} will be refunded. Questions? Call ${phone}.`);
      break;
    case 'refunded':
      await customer('order_refunded', `${biz}: Your refund of ${ghs(o.total_pesewas)} for order ${ref} has been issued.`);
      break;
  }
}

/** Fire-and-forget; safe to call from any request handler. */
export function notifyOrderEvent(orderId: number, event: OrderEvent) {
  background(sendOrderEvent(orderId, event));
}

export function notifyEnquiryReceived(e: { reference: string; customerPhone: string; customerName: string; productType: string }) {
  background(
    (async () => {
      await deliver({
        key: `enquiry:${e.reference}:received`, kind: 'enquiry_received', audience: 'customer', to: e.customerPhone, enquiryRef: e.reference,
        body: `${biz}: We received your enquiry ${e.reference}. We will contact you soon to confirm the details. Thank you!`,
      });
      await deliver({
        key: `owner:enquiry:${e.reference}`, kind: 'owner_new_enquiry', audience: 'owner', to: await ownerPhone(), enquiryRef: e.reference,
        body: `New enquiry ${e.reference}: ${e.productType} from ${e.customerName} ${e.customerPhone}`,
      });
    })(),
  );
}
