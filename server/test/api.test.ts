import test from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
import { setTokenVerifier } from '../auth.js';
import { createApp } from '../app.js';
import { normalizeGhanaPhone } from '../validation.js';

process.env.ADMIN_EMAILS = 'boss@pearls.com';

const mem = newDb();
const { Pool } = mem.adapters.createPg();
const pool = new Pool();
setDb(pool as any);
await migrate();
setTokenVerifier(async (t) => {
  const map: Record<string, any> = {
    cust: { uid: 'u1', email: 'ama@x.com', name: 'Ama Mensah' },
    boss: { uid: 'u2', email: 'boss@pearls.com', name: 'Pearl Owner' },
  };
  if (!map[t]) throw new Error('bad');
  return map[t];
});

const server = createApp().listen(0);
const base = `http://127.0.0.1:${(server.address() as any).port}`;
const call = (path: string, init: any = {}, token?: string) =>
  fetch(base + path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

const enquiry = { productType: 'Celebration Cake', customerName: 'Ama Mensah', customerPhone: '0551234567', quantity: '1' };

test('phone normalisation', () => {
  assert.equal(normalizeGhanaPhone('055 123 4567'), '+233551234567');
  assert.equal(normalizeGhanaPhone('+233551234567'), '+233551234567');
  assert.equal(normalizeGhanaPhone('12345'), null);
});

test('guest can submit an enquiry; invalid input rejected', async () => {
  const ok = await call('/api/enquiries', { method: 'POST', body: enquiry });
  assert.equal(ok.status, 201);
  const body: any = await ok.json();
  assert.match(body.reference, /^ENQ-/);
  assert.equal(body.customerPhone, '+233551234567');
  assert.equal(body.adminNotes, undefined);
  const bad = await call('/api/enquiries', { method: 'POST', body: { ...enquiry, customerPhone: 'abc' } });
  assert.equal(bad.status, 400);
});

test('signed-in enquiry is linked and listed under /mine only for owner', async () => {
  await call('/api/enquiries', { method: 'POST', body: enquiry }, 'cust');
  const mine: any = await (await call('/api/enquiries/mine', {}, 'cust')).json();
  assert.equal(mine.length, 1);
  assert.equal((await call('/api/enquiries/mine')).status, 401);
  const bossMine: any = await (await call('/api/enquiries/mine', {}, 'boss')).json();
  assert.equal(bossMine.length, 0);
});

test('profile update saves phone', async () => {
  const r = await call('/api/me', { method: 'PUT', body: { firstName: 'Ama', lastName: 'Mensah', phone: '0201112222' } }, 'cust');
  assert.equal(r.status, 200);
  assert.equal(((await r.json()) as any).phone, '+233201112222');
});

test('admin routes: customers forbidden, admin allowed, status update works', async () => {
  assert.equal((await call('/api/admin/enquiries', {}, 'cust')).status, 403);
  assert.equal((await call('/api/admin/enquiries')).status, 401);
  const list: any = await (await call('/api/admin/enquiries', {}, 'boss')).json();
  assert.ok(list.length >= 2);
  const patched: any = await (await call(`/api/admin/enquiries/${list[0].id}`, { method: 'PATCH', body: { status: 'quoted', adminNotes: 'GH₵ 500' } }, 'boss')).json();
  assert.equal(patched.status, 'quoted');
  assert.equal((await call(`/api/admin/enquiries/${list[0].id}`, { method: 'PATCH', body: { status: 'hacked' } }, 'boss')).status, 400);
});

test.after(() => server.close());
