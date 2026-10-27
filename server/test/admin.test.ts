import test from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import { setDb, migrate, getDb } from '../db.js';
import { setTokenVerifier } from '../auth.js';
import { createApp } from '../app.js';

process.env.ADMIN_EMAILS = 'boss@pearls.com';
const mem = newDb();
const { Pool } = mem.adapters.createPg();
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
const server = createApp().listen(0);
const base = `http://127.0.0.1:${(server.address() as any).port}`;
const call = async (path: string, init: any = {}, token?: string) => {
  const r = await fetch(base + path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  return { status: r.status, body: (await r.json().catch(() => null)) as any };
};
const future = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
const newOrder = async () =>
  (await call('/api/orders', {
    method: 'POST',
    body: {
      items: [{ productId: 'prod-bread-01', quantity: 2 }],
      fulfilment: 'pickup', preferredDate: future, customerName: 'Ama Mensah', customerPhone: '0551234567',
    },
  }, 'ama')).body;
/** Simulates what a verified Paystack payment does (settlePayment is covered in payments.test.ts). */
const markPaid = (reference: string) =>
  getDb().query(`UPDATE orders SET status='paid', payment_status='paid' WHERE reference=$1`, [reference]);

test('admin endpoints are closed to guests and customers', async () => {
  for (const p of ['/api/admin/summary', '/api/admin/orders', '/api/admin/payments/flagged']) {
    assert.equal((await call(p)).status, 401);
    assert.equal((await call(p, {}, 'ama')).status, 403);
  }
  const o = await newOrder();
  assert.equal((await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status: 'cancelled' } }, 'ama')).status, 403);
});

test('admin sees every customer\'s orders and can search them', async () => {
  const o = await newOrder();
  const all = await call('/api/admin/orders', {}, 'boss');
  assert.equal(all.status, 200);
  assert.ok(all.body.some((x: any) => x.reference === o.reference));
  const hit = await call('/api/admin/orders?q=' + o.reference.toLowerCase(), {}, 'boss');
  assert.equal(hit.body.length, 1);
  const miss = await call('/api/admin/orders?q=nobody-by-this-name', {}, 'boss');
  assert.equal(miss.body.length, 0);
  const detail = await call(`/api/admin/orders/${o.reference}`, {}, 'boss');
  assert.equal(detail.body.items.length, 1);
  assert.equal(detail.body.customerEmail, 'ama@x.com');
  assert.equal((await call('/api/admin/orders/PCC-NOPE', {}, 'boss')).status, 404);
});

test('an unpaid order cannot be marked paid or advanced by hand', async () => {
  const o = await newOrder();
  for (const status of ['paid', 'preparing', 'completed']) {
    assert.equal((await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status } }, 'boss')).status, 409);
  }
});

test('paid pickup order moves through the kitchen flow and skips out_for_delivery', async () => {
  const o = await newOrder();
  await markPaid(o.reference);
  const d = await call(`/api/admin/orders/${o.reference}`, {}, 'boss');
  assert.deepEqual(d.body.nextStatuses, ['preparing', 'cancelled']);
  const step = (status: string) => call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status } }, 'boss');
  assert.equal((await step('preparing')).body.status, 'preparing');
  const ready = await step('ready');
  assert.equal(ready.body.status, 'ready');
  assert.ok(!ready.body.nextStatuses.includes('out_for_delivery'));
  assert.equal((await step('out_for_delivery')).status, 409);
  assert.equal((await step('completed')).body.status, 'completed');
  assert.equal((await step('cancelled')).status, 409); // final
});

test('cancelling an unpaid order closes it to payment', async () => {
  const o = await newOrder();
  const r = await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status: 'cancelled' } }, 'boss');
  assert.equal(r.body.status, 'cancelled');
  assert.equal(r.body.paymentStatus, 'failed');
  assert.equal(r.body.needsRefund, false);
});

test('cancelling a paid order flags a refund until the owner records it', async () => {
  const o = await newOrder();
  await markPaid(o.reference);
  const noRefundYet = await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { paymentStatus: 'refunded' } }, 'boss');
  assert.equal(noRefundYet.status, 409); // not cancelled yet
  const c = await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status: 'cancelled' } }, 'boss');
  assert.equal(c.body.needsRefund, true);
  assert.ok((await call('/api/admin/summary', {}, 'boss')).body.refundsToProcess >= 1);
  const done = await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { paymentStatus: 'refunded' } }, 'boss');
  assert.equal(done.body.paymentStatus, 'refunded');
  assert.equal(done.body.needsRefund, false);
});

test('empty and invalid updates are rejected', async () => {
  const o = await newOrder();
  assert.equal((await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: {} }, 'boss')).status, 400);
  assert.equal((await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { status: 'shipped' } }, 'boss')).status, 400);
  assert.equal((await call(`/api/admin/orders/${o.reference}`, { method: 'PATCH', body: { paymentStatus: 'paid' } }, 'boss')).status, 400);
});

test('summary counts orders, 30-day revenue, new enquiries', async () => {
  const before = (await call('/api/admin/summary', {}, 'boss')).body;
  const o = await newOrder();
  await markPaid(o.reference);
  await call('/api/enquiries', { method: 'POST', body: { productType: 'Cake', customerName: 'Ama', customerPhone: '0551234567' } });
  const after = (await call('/api/admin/summary', {}, 'boss')).body;
  assert.equal(after.orders.paid, before.orders.paid + 1);
  assert.equal(after.activeOrders, before.activeOrders + 1);
  assert.equal(after.last30Days.revenuePesewas, before.last30Days.revenuePesewas + 9000);
  assert.equal(after.newEnquiries, before.newEnquiries + 1);
});

test('duplicate payments are listed and can be ticked off once refunded', async () => {
  const o = await newOrder();
  await markPaid(o.reference);
  const { rows } = await getDb().query('SELECT id FROM orders WHERE reference=$1', [o.reference]);
  const ins = await getDb().query(
    `INSERT INTO payments (order_id, reference, amount_pesewas, status, note, paid_at)
     VALUES ($1,$2,9000,'success','duplicate_payment_needs_refund', now()) RETURNING id`,
    [rows[0].id, o.reference + '-DUP'],
  );
  const list = await call('/api/admin/payments/flagged', {}, 'boss');
  assert.ok(list.body.some((p: any) => p.orderReference === o.reference && p.amountPesewas === 9000));
  const id = ins.rows[0].id;
  assert.equal((await call(`/api/admin/payments/${id}/refunded`, { method: 'POST' }, 'ama')).status, 403);
  assert.equal((await call(`/api/admin/payments/${id}/refunded`, { method: 'POST' }, 'boss')).status, 200);
  assert.equal((await call(`/api/admin/payments/${id}/refunded`, { method: 'POST' }, 'boss')).status, 404); // once only
  const after = await call('/api/admin/payments/flagged', {}, 'boss');
  assert.ok(!after.body.some((p: any) => p.id === id));
});

test.after(() => server.close());
