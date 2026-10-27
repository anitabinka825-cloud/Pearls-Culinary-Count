import test from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import { setDb, migrate } from '../db.js';
import { createApp } from '../app.js';
import { checkProductionEnv, cspDirectives } from '../security.js';

const mem = newDb();
const { Pool } = mem.adapters.createPg();
setDb(new Pool() as any);
await migrate();

const server = createApp().listen(0);
const base = `http://127.0.0.1:${(server.address() as any).port}`;
test.after(() => server.close());

test('security headers are present and Google pop-up sign-in is allowed', async () => {
  const res = await fetch(base + '/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-powered-by'), null);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('cross-origin-opener-policy'), 'same-origin-allow-popups');
  assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  // Report-only by default so a wrong origin cannot break sign-in or checkout on day one.
  const csp = res.headers.get('content-security-policy-report-only') || '';
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(res.headers.get('content-security-policy'), null);
});

test('API responses are not cached, except the public settings', async () => {
  assert.equal((await fetch(base + '/api/health')).headers.get('cache-control'), 'no-store');
  assert.equal((await fetch(base + '/api/settings')).headers.get('cache-control'), 'public, max-age=30');
});

test('deep health check confirms the database answers', async () => {
  const res = await fetch(base + '/api/health?deep=1');
  assert.deepEqual(await res.json(), { ok: true, db: true });
});

test('admin routes still reject anonymous callers', async () => {
  assert.equal((await fetch(base + '/api/admin/summary')).status, 401);
});

test('CSP lists the third parties the site uses and nothing broad', () => {
  const d = cspDirectives();
  assert.ok(d.imgSrc.includes('https://images.unsplash.com'));
  assert.ok(d.connectSrc.includes('https://identitytoolkit.googleapis.com'));
  assert.ok(!d.scriptSrc.includes("'unsafe-inline'") && !d.scriptSrc.includes("'unsafe-eval'"));
  assert.deepEqual(d.objectSrc, ["'none'"]);
});

test('production env check names what is missing', () => {
  const bad = checkProductionEnv({ APP_URL: 'http://x.com' } as any);
  assert.ok(bad.errors.some((e) => e.startsWith('DATABASE_URL')));
  assert.ok(bad.errors.some((e) => e.startsWith('ADMIN_EMAILS')));
  assert.ok(bad.errors.some((e) => e.includes('https://')));

  const good = checkProductionEnv({
    DATABASE_URL: 'postgres://x', APP_URL: 'https://pearls.example', ADMIN_EMAILS: 'a@b.com',
    PAYSTACK_SECRET_KEY: 'sk_test_x', VITE_FIREBASE_PROJECT_ID: 'p',
  } as any);
  assert.deepEqual(good.errors, []);
  assert.ok(good.warnings.some((w) => w.includes('TEST key')));
});
