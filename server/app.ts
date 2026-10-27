import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { meRouter } from './routes/me.js';
import { paymentsRouter, paystackWebhook } from './routes/payments.js';
import { ordersRouter } from './routes/orders.js';
import { zonesRouter, adminZonesRouter } from './routes/zones.js';
import { enquiriesRouter, adminEnquiriesRouter } from './routes/enquiries.js';
import { adminRouter } from './routes/admin.js';
import { settingsRouter, adminSettingsRouter } from './routes/settings.js';
import { sailupWebhook } from './routes/sailupWebhook.js';
import { securityHeaders, apiNoStore, globalApiLimiter, adminLimiter } from './security.js';
import { getDb } from './db.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(securityHeaders());
  const origins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (origins.length) app.use(cors({ origin: origins }));
  // Webhook needs the raw body for signature checking, so it is registered before the JSON parser.
  app.post('/api/webhooks/paystack', express.raw({ type: '*/*', limit: '100kb' }), paystackWebhook);
  app.post('/api/webhooks/sailup', express.raw({ type: '*/*', limit: '100kb' }), sailupWebhook);
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', apiNoStore, globalApiLimiter());
  app.use('/api/admin', adminLimiter());

  // Liveness for the host's health check; add ?deep=1 to also confirm the database answers.
  app.get('/api/health', async (req, res) => {
    if (!req.query.deep) return res.json({ ok: true });
    try {
      await getDb().query('SELECT 1');
      res.json({ ok: true, db: true });
    } catch {
      res.status(503).json({ ok: false, db: false });
    }
  });
  app.use('/api/me', meRouter);
  app.use('/api/enquiries', enquiriesRouter);
  app.use('/api/admin/enquiries', adminEnquiriesRouter);
  app.use('/api/orders', paymentsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/delivery-zones', zonesRouter);
  app.use('/api/admin/delivery-zones', adminZonesRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/admin/settings', adminSettingsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // Serve the built SPA in production (same origin as the API).
  const dist = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(dist)) {
    // Vite file names contain a content hash, so they can be cached for a year; the page itself must not be.
    app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '365d', index: false }));
    app.use(express.static(dist, { index: false, maxAge: '1h' }));
    // SPA fallback (Express 5 no longer accepts a bare '*' route pattern).
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  });
  return app;
}
