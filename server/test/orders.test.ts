import test from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
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
    kofi: { uid: 'u3', email: 'kofi@x.com', name: 'Kofi Boateng' },
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
const base_order = {
  items: [{ productId: 'prod-bread-01', quantity: 2 }],
  fulfilment: 'pickup', preferredDate: future, customerName: 'Ama Mensah', customerPhone: '0551234567',
};

test('delivery zones are seeded inactive, so nothing is publicly deliverable until the owner enables it', async () => {
  assert.deepEqual((await call('/api/delivery-zones')).body, []);
  const all = await call('/api/admin/delivery-zones', {}, 'boss');
  assert.ok(all.body.length > 5);
  assert.equal((await call('/api/admin/delivery-zones', {}, 'ama')).status, 403);
});

test('pickup order is priced by the server; client prices are ignored', async () => {
  const r = await call('/api/orders', { method: 'POST', body: { ...base_order, items: [{ productId: 'prod-bread-01', quantity: 2, price: 1 }] } }, 'ama');
  assert.equal(r.status, 201);
  assert.equal(r.body.subtotalPesewas, 9000);
  assert.equal(r.body.totalPesewas, 9000);
  assert.equal(r.body.paymentStatus, 'unpaid');
  assert.match(r.body.reference, /^PCC-[A-Z0-9]{6}$/);
});

test('guests cannot order', async () => {
  assert.equal((await call('/api/orders', { method: 'POST', body: base_order })).status, 401);
});

test('variant pricing, duplicate-line merging, and rejected items', async () => {
  const ok = await call('/api/orders', { method: 'POST', body: { ...base_order, items: [
    { productId: 'prod-cake-01', variantId: 'var-cake-01-8in', quantity: 1 },
    { productId: 'prod-bread-01', quantity: 1 }, { productId: 'prod-bread-01', quantity: 1 } ] } }, 'ama');
  assert.equal(ok.status, 201);
  assert.equal(ok.body.items.length, 2);
  assert.equal(ok.body.subtotalPesewas, 45000 + 9000);
  const enq = await call('/api/orders', { method: 'POST', body: { ...base_order, items: [{ productId: 'prod-cake-02', quantity: 1 }] } }, 'ama');
  assert.equal(enq.status, 400);
  const novar = await call('/api/orders', { method: 'POST', body: { ...base_order, items: [{ productId: 'prod-cake-01', quantity: 1 }] } }, 'ama');
  assert.equal(novar.status, 400);
  const fake = await call('/api/orders', { method: 'POST', body: { ...base_order, items: [{ productId: 'nope', quantity: 1 }] } }, 'ama');
  assert.equal(fake.status, 400);
  const past = await call('/api/orders', { method: 'POST', body: { ...base_order, preferredDate: '2020-01-01' } }, 'ama');
  assert.equal(past.status, 400);
});

test('delivery uses the admin-set fee; inactive or missing zones are refused', async () => {
  const all = (await call('/api/admin/delivery-zones', {}, 'boss')).body;
  const z = all.find((x: any) => x.name === 'East Legon');
  const del = { ...base_order, fulfilment: 'delivery', zoneId: z.id, deliveryAddress: '12 Palm Street, East Legon' };
  assert.equal((await call('/api/orders', { method: 'POST', body: del }, 'ama')).status, 400); // inactive
  const upd = await call(`/api/admin/delivery-zones/${z.id}`, { method: 'PATCH', body: { feePesewas: 3500, active: true } }, 'boss');
  assert.equal(upd.body.feePesewas, 3500);
  assert.equal((await call('/api/delivery-zones')).body.length, 1);
  const r = await call('/api/orders', { method: 'POST', body: del }, 'ama');
  assert.equal(r.status, 201);
  assert.equal(r.body.deliveryFeePesewas, 3500);
  assert.equal(r.body.totalPesewas, 9000 + 3500);
  assert.equal(r.body.zoneName, 'East Legon');
  assert.equal((await call('/api/orders', { method: 'POST', body: { ...del, deliveryAddress: '' } }, 'ama')).status, 400);
  assert.equal((await call('/api/orders', { method: 'POST', body: { ...del, zoneId: undefined } }, 'ama')).status, 400);
});

test('orders are private to their owner (admin can view)', async () => {
  const mine = (await call('/api/orders/mine', {}, 'ama')).body;
  assert.ok(mine.length >= 3);
  const ref = mine[0].reference;
  assert.equal((await call(`/api/orders/${ref}`, {}, 'ama')).status, 200);
  assert.equal((await call(`/api/orders/${ref}`, {}, 'kofi')).status, 404);
  assert.equal((await call(`/api/orders/${ref}`, {}, 'boss')).status, 200);
  assert.equal((await call('/api/orders/mine', {}, 'kofi')).body.length, 0);
});

test.after(() => server.close());
