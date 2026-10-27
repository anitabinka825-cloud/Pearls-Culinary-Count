import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
import { setTokenVerifier } from '../auth.js';
import { setPaystackClient } from '../paystack.js';
import { setSmsTransport, sailupFromEnv, toGsm, smsSegments, verifySailupSignature, type SmsTransport } from '../sailup.js';
import { notificationsIdle } from '../notify.js';
import { createApp } from '../app.js';

process.env.PAYSTACK_SECRET_KEY = 'sk_test_secret';
process.env.ADMIN_EMAILS = 'boss@pearls.com';
process.env.SMS_OWNER_PHONE = '0552471271';
process.env.SAILUP_WEBHOOK_SECRET = 'whsec_test';
const { Pool } = newDb().adapters.createPg();
setDb(new Pool() as any);
await migrate();
setTokenVerifier(async (t) => {
  const m: Record<string, any> = {
    ama: { uid: 'u1', email: 'ama@x.com', name: 'Ama Mensah' },
    boss: { uid: 'u2', email: 'boss@pearls.com', name: 'Owner' },
  };
  if (!m[t]) throw new Error('bad');
  return m[t];
});

const verifyResults = new Map<string, any>();
const initCalls: any[] = [];
setPaystackClient({
  async initialize(i) {
    initCalls.push(i);
    return { authorizationUrl: `https://checkout.paystack.test/${i.reference}`, reference: i.reference };
  },
  async verify(ref) {
    return { reference: ref, channel: 'mobile_money', currency: 'GHS', ...verifyResults.get(ref) };
  },
});

// Fake SMS provider: records every message, and can be told to fail.
const sent: { to: string; body: string }[] = [];
let failNext = false;
let n = 0;
const fake: SmsTransport = {
  async send(to, body) {
    if (failNext) { failNext = false; throw new Error('Sailup 402: insufficient_balance'); }
    sent.push({ to, body });
    return { id: `msg-${++n}` };
  },
  async credits() {
    return { balance: 1240, autoTopup: { enabled: false, threshold: 0, topupQuantity: 0 } };
  },
};
setSmsTransport(fake);

const server = createApp().listen(0);
const base = `http://127.0.0.1:${(server.address() as any).port}`;
const call = async (path: string, init: any = {}, token?: string) => {
  const r = await fetch(base + path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(init.headers || {}) },
    body: init.rawBody ?? (init.body ? JSON.stringify(init.body) : undefined),
  });
  return { status: r.status, body: (await r.json().catch(() => null)) as any };
};
const future = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
const newOrder = async (fulfilment: 'pickup' | 'delivery' = 'pickup') =>
  (await call('/api/orders', { method: 'POST', body: {
    items: [{ productId: 'prod-bread-01', quantity: 2 }], fulfilment, preferredDate: future,
    customerName: 'Ama Mensah', customerPhone: '0551234567' } }, 'ama')).body;
const payOrder = async (reference: string, amount = 9000) => {
  await call(`/api/orders/${reference}/pay`, { method: 'POST' }, 'ama');
  verifyResults.set(initCalls.at(-1).reference, { status: 'success', amountPesewas: amount });
  const r = await call(`/api/orders/${reference}/verify`, { method: 'POST' }, 'ama');
  await notificationsIdle();
  return r;
};
const log = async () => (await call('/api/admin/sms', {}, 'boss')).body as any[];
const forOrder = async (ref: string) => (await log()).filter((m) => m.orderReference === ref);
const step = (ref: string, status: string) => call(`/api/admin/orders/${ref}`, { method: 'PATCH', body: { status } }, 'boss');

test('GSM-7 helper keeps messages in the cheap 160-character alphabet', () => {
  assert.equal(toGsm('Pay ₵90 — it’s “ready”'), 'Pay GHS 90 - it\'s "ready"');
  assert.equal(toGsm('Café 😀'), 'Café ?');
  assert.equal(smsSegments('a'.repeat(160)), 1);
  assert.equal(smsSegments('a'.repeat(161)), 2);
  assert.equal(smsSegments('{'.repeat(81)), 2); // extension characters count double
});

test('webhook signature check matches Sailup\'s scheme and rejects tampering', () => {
  const raw = Buffer.from('{"a":1}');
  const sig = 'sha256=' + crypto.createHmac('sha256', 's').update('1700000000.').update(raw).digest('hex');
  assert.equal(verifySailupSignature(raw, sig, '1700000000', 's'), true);
  assert.equal(verifySailupSignature(Buffer.from('{"a":2}'), sig, '1700000000', 's'), false);
  assert.equal(verifySailupSignature(raw, sig, '1700000001', 's'), false);
  assert.equal(verifySailupSignature(raw, sig, '1700000000', ''), false);
  assert.equal(verifySailupSignature(raw, 'sha256=zz', '1700000000', 's'), false);
});

test('Sailup client calls the documented endpoints with the key and registered sender', async () => {
  process.env.SAILUP_API_KEY = 'sailup_key';
  process.env.SAILUP_SENDER_ID = 'Pearls';
  const calls: any[] = [];
  const stub = (async (url: string, init: any) => {
    calls.push({ url, init });
    const body = url.endsWith('/sms/credits/')
      ? { balance: 50, auto_topup: { enabled: true, threshold: 10, topup_quantity: 500 } }
      : { id: 'abc', status: 'queued' };
    return new Response(JSON.stringify(body), { status: url.endsWith('/sms/') ? 202 : 200 });
  }) as unknown as typeof fetch;
  const t = sailupFromEnv(stub)!;
  assert.deepEqual(await t.send('+233551234567', 'Hi'), { id: 'abc' });
  assert.equal(calls[0].url, 'https://api.sailup.io/v1/sms/');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer sailup_key');
  assert.deepEqual(JSON.parse(calls[0].init.body), { from: 'Pearls', to: ['+233551234567'], body: 'Hi' });
  assert.deepEqual(await t.credits(), { balance: 50, autoTopup: { enabled: true, threshold: 10, topupQuantity: 500 } });
  delete process.env.SAILUP_SENDER_ID;
  await assert.rejects(() => t.send('+233551234567', 'Hi'), /SAILUP_SENDER_ID/);
  const failing = sailupFromEnv((async () => new Response('{"error":"insufficient_balance"}', { status: 402 })) as unknown as typeof fetch)!;
  process.env.SAILUP_SENDER_ID = 'Pearls';
  await assert.rejects(() => failing.send('+233551234567', 'Hi'), /402/);
  delete process.env.SAILUP_API_KEY;
});

test('a paid order texts the customer and the owner exactly once', async () => {
  sent.length = 0;
  const o = await newOrder();
  assert.equal((await forOrder(o.reference)).length, 0); // nothing before payment
  assert.equal((await payOrder(o.reference)).body.paymentStatus, 'paid');
  await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama'); // repeat is a no-op
  await notificationsIdle();
  const customer = sent.filter((m) => m.to === '+233551234567' && m.body.includes(o.reference));
  const owner = sent.filter((m) => m.to === '+233552471271' && m.body.includes(o.reference));
  assert.equal(customer.length, 1);
  assert.equal(owner.length, 1);
  assert.match(customer[0].body, /GHS 90\.00/);
  assert.equal((await forOrder(o.reference)).every((m) => m.state === 'sent'), true);
});

test('every message template fits one 160-character segment in GSM-7', async () => {
  const o = await newOrder('pickup');
  await payOrder(o.reference);
  await step(o.reference, 'preparing');
  await step(o.reference, 'ready');
  await step(o.reference, 'cancelled');
  await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { paymentStatus: 'refunded' } }, 'boss');
  await notificationsIdle();
  const msgs = await forOrder(o.reference);
  assert.deepEqual(msgs.map((m) => m.kind).sort(), ['order_cancelled', 'order_paid', 'order_ready', 'order_refunded', 'owner_new_order']);
  for (const m of msgs) {
    assert.equal(toGsm(m.body), m.body, `${m.kind} must already be GSM-7`);
    assert.equal(smsSegments(m.body), 1, `${m.kind} is ${m.body.length} chars: ${m.body}`);
  }
});

test('delivery orders get "out for delivery"; cancelling an unpaid order sends nothing', async () => {
  const zones = (await call('/api/admin/delivery-zones', {}, 'boss')).body;
  await call(`/api/admin/delivery-zones/${zones[0].id}`, { method: 'PATCH', body: { feePesewas: 3500, active: true } }, 'boss');
  const d = (await call('/api/orders', { method: 'POST', body: {
    items: [{ productId: 'prod-bread-01', quantity: 2 }], fulfilment: 'delivery', zoneId: zones[0].id,
    deliveryAddress: '12 Palm Street', preferredDate: future, customerName: 'Ama Mensah', customerPhone: '0551234567' } }, 'ama')).body;
  await payOrder(d.reference, 12500);
  await step(d.reference, 'preparing');
  await step(d.reference, 'ready');
  await step(d.reference, 'out_for_delivery');
  await notificationsIdle();
  const kinds = (await forOrder(d.reference)).map((m) => m.kind);
  assert.ok(kinds.includes('order_out') && kinds.includes('order_ready'));

  const unpaid = await newOrder();
  await step(unpaid.reference, 'cancelled');
  await notificationsIdle();
  assert.equal((await forOrder(unpaid.reference)).length, 0);
});

test('a failing SMS provider never breaks the payment; the message can be resent', async () => {
  const o = await newOrder();
  failNext = true; // the customer text will fail; the owner text goes through
  const r = await payOrder(o.reference);
  assert.equal(r.body.paymentStatus, 'paid');
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.status, 'paid');
  const failed = (await forOrder(o.reference)).find((m) => m.state === 'failed')!;
  assert.match(failed.error, /insufficient_balance/);

  const before = sent.length;
  assert.equal((await call(`/api/admin/sms/${failed.id}/resend`, { method: 'POST' }, 'ama')).status, 403);
  const re = await call(`/api/admin/sms/${failed.id}/resend`, { method: 'POST' }, 'boss');
  assert.equal(re.body.state, 'sent');
  assert.equal(sent.length, before + 1);
  assert.equal((await call(`/api/admin/sms/${failed.id}/resend`, { method: 'POST' }, 'boss')).status, 409); // only once
});

test('without Sailup configured, messages are logged as not sent and can be sent later', async () => {
  setSmsTransport(null);
  const o = await newOrder();
  assert.equal((await payOrder(o.reference)).body.paymentStatus, 'paid');
  const skipped = (await forOrder(o.reference)).filter((m) => m.state === 'skipped');
  assert.equal(skipped.length, 2);
  setSmsTransport(fake);
  const before = sent.length;
  assert.equal((await call(`/api/admin/sms/${skipped[0].id}/resend`, { method: 'POST' }, 'boss')).body.state, 'sent');
  assert.equal(sent.length, before + 1);
});

test('a new enquiry texts the customer and the owner', async () => {
  sent.length = 0;
  const e = await call('/api/enquiries', { method: 'POST', body: { productType: 'Wedding cake', customerName: 'Efua Addo', customerPhone: '0201112222' } });
  await notificationsIdle();
  assert.ok(sent.some((m) => m.to === '+233201112222' && m.body.includes(e.body.reference)));
  assert.ok(sent.some((m) => m.to === '+233552471271' && m.body.includes('Wedding cake')));
});

test('delivery webhook: unsigned requests are refused, signed ones record the outcome', async () => {
  const o = await newOrder();
  await payOrder(o.reference);
  const msg = (await forOrder(o.reference)).find((m) => m.kind === 'order_paid')!;
  const { rows } = await (await import('../db.js')).getDb().query('SELECT provider_id FROM sms_log WHERE id=$1', [msg.id]);
  const raw = JSON.stringify({ event: 'message.delivered', created_at: new Date().toISOString(), data: { message_id: rows[0].provider_id, delivery_status: 'delivered' } });
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = 'sha256=' + crypto.createHmac('sha256', 'whsec_test').update(`${ts}.${raw}`).digest('hex');
  const post = (signature: string) => call('/api/webhooks/sailup', { method: 'POST', rawBody: raw, headers: { 'x-sailup-signature': signature, 'x-sailup-timestamp': ts } });
  assert.equal((await post('sha256=' + '0'.repeat(64))).status, 401);
  assert.equal((await log()).find((m) => m.id === msg.id).deliveryStatus, '');
  assert.equal((await post(sig)).status, 200);
  assert.equal((await post(sig)).status, 200); // retries are harmless
  assert.equal((await log()).find((m) => m.id === msg.id).deliveryStatus, 'delivered');
});

test('SMS admin endpoints are staff-only; credits report the balance', async () => {
  assert.equal((await call('/api/admin/sms')).status, 401);
  assert.equal((await call('/api/admin/sms', {}, 'ama')).status, 403);
  assert.equal((await call('/api/admin/sms/credits', {}, 'ama')).status, 403);
  const c = await call('/api/admin/sms/credits', {}, 'boss');
  assert.deepEqual(c.body, { configured: true, balance: 1240, autoTopup: { enabled: false, threshold: 0, topupQuantity: 0 } });
  setSmsTransport(null);
  assert.deepEqual((await call('/api/admin/sms/credits', {}, 'boss')).body, { configured: false });
  setSmsTransport(fake);
});

test.after(() => server.close());
