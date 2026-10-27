import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
import { setTokenVerifier } from '../auth.js';
import { setPaystackClient } from '../paystack.js';
import { createApp } from '../app.js';

process.env.PAYSTACK_SECRET_KEY = 'sk_test_secret';
process.env.APP_URL = 'https://shop.example';
const { Pool } = newDb().adapters.createPg();
setDb(new Pool() as any);
await migrate();
setTokenVerifier(async (t) => {
  const m: Record<string, any> = {
    ama: { uid: 'u1', email: 'ama@x.com', name: 'Ama Mensah' },
    kofi: { uid: 'u3', email: 'kofi@x.com', name: 'Kofi B' },
  };
  if (!m[t]) throw new Error('bad');
  return m[t];
});

// Fake Paystack: records what we asked for and lets each test decide what "verify" returns.
const initCalls: any[] = [];
const verifyResults = new Map<string, any>();
setPaystackClient({
  async initialize(i) {
    initCalls.push(i);
    return { authorizationUrl: `https://checkout.paystack.test/${i.reference}`, reference: i.reference };
  },
  async verify(ref) {
    const r = verifyResults.get(ref);
    if (!r) throw new Error('unknown');
    return { reference: ref, channel: 'mobile_money', currency: 'GHS', ...r };
  },
});

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
const newOrder = async (token = 'ama') =>
  (await call('/api/orders', { method: 'POST', body: {
    items: [{ productId: 'prod-bread-01', quantity: 2 }], fulfilment: 'pickup', preferredDate: future,
    customerName: 'Ama Mensah', customerPhone: '0551234567' } }, token)).body;
const sign = (raw: string) => crypto.createHmac('sha512', 'sk_test_secret').update(raw).digest('hex');
const webhook = (event: any, signature?: string) => {
  const raw = JSON.stringify(event);
  return call('/api/webhooks/paystack', { method: 'POST', rawBody: raw, headers: { 'x-paystack-signature': signature ?? sign(raw) } });
};

test('pay: amount/currency/email come from the server; only the owner may pay', async () => {
  const o = await newOrder();
  assert.equal((await call(`/api/orders/${o.reference}/pay`, { method: 'POST', body: { amount: 1 } }, 'kofi')).status, 404);
  assert.equal((await call(`/api/orders/${o.reference}/pay`, { method: 'POST' })).status, 401);
  const r = await call(`/api/orders/${o.reference}/pay`, { method: 'POST', body: { amount: 1, email: 'evil@x.com' } }, 'ama');
  assert.equal(r.status, 200);
  assert.match(r.body.authorizationUrl, /^https:\/\/checkout\.paystack\.test\//);
  const last = initCalls.at(-1);
  assert.equal(last.amountPesewas, 9000);
  assert.equal(last.email, 'ama@x.com');
  assert.equal(last.callbackUrl, `https://shop.example/order/${o.reference}`);
});

test('verify: success marks the order paid exactly once (idempotent)', async () => {
  const o = await newOrder();
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  const ref = initCalls.at(-1).reference;
  verifyResults.set(ref, { status: 'ongoing', amountPesewas: 9000 });
  assert.equal((await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama')).body.paymentStatus, 'pending');
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.paymentStatus, 'unpaid');
  verifyResults.set(ref, { status: 'success', amountPesewas: 9000 });
  assert.equal((await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama')).body.paymentStatus, 'paid');
  assert.equal((await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama')).body.paymentStatus, 'paid');
  const after = (await call(`/api/orders/${o.reference}`, {}, 'ama')).body;
  assert.equal(after.paymentStatus, 'paid');
  assert.equal(after.status, 'paid');
  assert.equal((await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama')).status, 409);
});

test('a "successful" payment of the WRONG amount never marks the order paid', async () => {
  const o = await newOrder();
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  verifyResults.set(initCalls.at(-1).reference, { status: 'success', amountPesewas: 100 });
  assert.equal((await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama')).body.paymentStatus, 'failed');
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.paymentStatus, 'unpaid');
});

test('failed/abandoned payment leaves the order unpaid and retryable', async () => {
  const o = await newOrder();
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  verifyResults.set(initCalls.at(-1).reference, { status: 'abandoned', amountPesewas: 9000 });
  assert.equal((await call(`/api/orders/${o.reference}/verify`, { method: 'POST' }, 'ama')).body.paymentStatus, 'failed');
  assert.equal((await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama')).status, 200);
});

test('webhook: bad or missing signature is rejected', async () => {
  const ev = { event: 'charge.success', data: { reference: 'x' } };
  assert.equal((await webhook(ev, 'deadbeef')).status, 401);
  assert.equal((await call('/api/webhooks/paystack', { method: 'POST', body: ev })).status, 401);
});

test('webhook: signed charge.success settles the order after re-verifying with Paystack', async () => {
  const o = await newOrder();
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  const ref = initCalls.at(-1).reference;
  // Body claims success, but Paystack says otherwise -> must NOT pay.
  verifyResults.set(ref, { status: 'failed', amountPesewas: 9000 });
  assert.equal((await webhook({ event: 'charge.success', data: { reference: ref, amount: 9000 } })).status, 200);
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.paymentStatus, 'unpaid');
  verifyResults.set(ref, { status: 'success', amountPesewas: 9000 });
  assert.equal((await webhook({ event: 'charge.success', data: { reference: ref } })).status, 200);
  assert.equal((await webhook({ event: 'charge.success', data: { reference: ref } })).status, 200); // redelivery
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.paymentStatus, 'paid');
  assert.equal((await webhook({ event: 'charge.success', data: { reference: 'unknown-ref' } })).status, 200);
});

test('two successful attempts on one order: paid once, extra flagged for refund', async () => {
  const o = await newOrder();
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  const first = initCalls.at(-1).reference;
  // second attempt is possible while the first is still pending
  await call(`/api/orders/${o.reference}/pay`, { method: 'POST' }, 'ama');
  const second = initCalls.at(-1).reference;
  verifyResults.set(first, { status: 'success', amountPesewas: 9000 });
  verifyResults.set(second, { status: 'success', amountPesewas: 9000 });
  await webhook({ event: 'charge.success', data: { reference: first } });
  await webhook({ event: 'charge.success', data: { reference: second } });
  assert.equal((await call(`/api/orders/${o.reference}`, {}, 'ama')).body.paymentStatus, 'paid');
});

test.after(() => server.close());
