import test from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
import { setTokenVerifier } from '../auth.js';
import { setSmsTransport, type SmsTransport } from '../sailup.js';
import { notificationsIdle } from '../notify.js';
import { createApp } from '../app.js';

process.env.ADMIN_EMAILS = 'boss@pearls.com';
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
const sent: { to: string; body: string }[] = [];
setSmsTransport({
  async send(to, body) { sent.push({ to, body }); return { id: `m${sent.length}` }; },
  async credits() { return { balance: 100, autoTopup: { enabled: true, threshold: 0, topupQuantity: 0 } }; },
} as SmsTransport);

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
const put = (body: any, token = 'boss') => call('/api/admin/settings', { method: 'PUT', body }, token);
const future = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
const order = () => call('/api/orders', { method: 'POST', body: {
  items: [{ productId: 'prod-bread-01', quantity: 1 }], fulfilment: 'pickup', preferredDate: future,
  customerName: 'Ama Mensah', customerPhone: '0551234567' } }, 'ama');

test('before anything is saved, the public settings are empty defaults (site falls back to built-ins)', async () => {
  const r = await call('/api/settings');
  assert.equal(r.status, 200);
  assert.equal(r.body.phone, '');
  assert.equal(r.body.ordersPaused, false);
  assert.deepEqual(r.body.socials, { instagram: '', facebook: '', tiktok: '', youtube: '', x: '' });
});

test('only admins can read or change settings', async () => {
  assert.equal((await call('/api/admin/settings')).status, 401);
  assert.equal((await call('/api/admin/settings', {}, 'ama')).status, 403);
  assert.equal((await put({ phone: '0201112222' }, 'ama')).status, 403);
});

test('saving cleans up input and publishes it, but never leaks the owner alert number', async () => {
  const r = await put({
    phone: '020 111 2222', whatsapp: '0201112222', email: 'hello@pearls.com',
    instagram: 'instagram.com/pearlsculinary', facebook: 'http://www.facebook.com/pearls', x: 'https://twitter.com/pearls',
    careHours: 'Mon-Sat, 8am-6pm', announcement: 'Closed on Monday for stocktaking',
    ownerAlertPhone: '0552471271',
  });
  assert.equal(r.status, 200);
  assert.equal(r.body.phone, '+233201112222');
  assert.equal(r.body.instagram, 'https://instagram.com/pearlsculinary');
  assert.equal(r.body.facebook, 'https://www.facebook.com/pearls'); // upgraded to https
  const pub = (await call('/api/settings')).body;
  assert.equal(pub.phone, '+233201112222');
  assert.equal(pub.socials.instagram, 'https://instagram.com/pearlsculinary');
  assert.equal(pub.announcement, 'Closed on Monday for stocktaking');
  assert.ok(!JSON.stringify(pub).includes('233552471271'), 'owner alert number must stay private');
  assert.equal((await call('/api/admin/settings', {}, 'boss')).body.ownerAlertPhone, '+233552471271');
});

test('bad phone numbers, emails and look-alike or dangerous links are rejected', async () => {
  const bad: any[] = [
    { phone: '12345' },
    { email: 'not-an-email' },
    { instagram: 'javascript:alert(1)' },
    { instagram: 'https://evil.com/instagram.com' },
    { instagram: 'https://instagram.com.evil.com/pearls' },
    { instagram: 'https://instagram.com@evil.com' },
    { facebook: 'https://user:pw@facebook.com/x' },
    { tiktok: 'https://instagram.com/pearls' }, // right shape, wrong platform
    { announcement: 'x'.repeat(201) },
  ];
  for (const b of bad) assert.equal((await put(b)).status, 400, JSON.stringify(b));
  // Rejected saves changed nothing.
  assert.equal((await call('/api/settings')).body.phone, '+233201112222');
});

test('clearing a field goes back to the built-in value', async () => {
  const r = await put({ phone: '', instagram: '' });
  assert.equal(r.status, 200);
  assert.equal((await call('/api/settings')).body.phone, '');
});

test('pausing orders blocks checkout with the owner\'s message; enquiries still work; unpausing restores it', async () => {
  assert.equal((await order()).status, 201);
  await put({ ordersPaused: true, pauseMessage: 'We are on holiday until Monday.' });
  const pub = (await call('/api/settings')).body;
  assert.equal(pub.ordersPaused, true);
  assert.equal(pub.pauseMessage, 'We are on holiday until Monday.');
  const blocked = await order();
  assert.equal(blocked.status, 409);
  assert.equal(blocked.body.error, 'We are on holiday until Monday.');
  const enq = await call('/api/enquiries', { method: 'POST', body: { productType: 'Cake', customerName: 'Ama', customerPhone: '0551234567' } });
  assert.equal(enq.status, 201);
  await put({ ordersPaused: true }); // no custom message -> sensible default
  assert.match((await call('/api/settings')).body.pauseMessage, /paused/i);
  await put({ ordersPaused: false, pauseMessage: 'left over' });
  assert.equal((await call('/api/settings')).body.pauseMessage, ''); // not shown while not paused
  assert.equal((await order()).status, 201);
});

test('owner alerts go to the dashboard number, and customer texts quote the current phone', async () => {
  await put({ phone: '0201112222', ownerAlertPhone: '0244000111' });
  sent.length = 0;
  const e = await call('/api/enquiries', { method: 'POST', body: { productType: 'Cupcakes', customerName: 'Efua', customerPhone: '0201112222' } });
  await notificationsIdle();
  assert.ok(sent.some((m) => m.to === '+233244000111' && m.body.includes(e.body.reference)));
});

test.after(() => server.close());
