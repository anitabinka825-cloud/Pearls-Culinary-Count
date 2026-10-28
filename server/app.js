import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { query } from './db.js';
import { securityHeaders, apiLimiter, authLimiter } from './middleware/security.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';
import paymentsRouter, { paystackWebhook } from './routes/payments.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // Render sits behind a proxy; needed for correct IPs in rate limits
  app.disable('x-powered-by');
  app.use(securityHeaders());
  if (config.corsOrigins.length) app.use(cors({ origin: config.corsOrigins }));

  // Webhooks need the RAW body to verify signatures, so register before express.json().
  app.post('/api/webhooks/paystack', express.raw({ type: '*/*', limit: '100kb' }), paystackWebhook);
  app.use(express.json({ limit: '100kb' }));

  // Health check for Render. Add ?deep=1 to also confirm the database answers.
  app.get('/api/health', async (req, res) => {
    if (!req.query.deep) return res.json({ ok: true });
    try {
      await query('SELECT 1');
      res.json({ ok: true, db: true });
    } catch {
      res.status(503).json({ ok: false, db: false });
    }
  });

  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); }, apiLimiter());
  app.use('/api/auth', authLimiter(), authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // Production: serve the built React app from the same origin as the API.
  const dist = path.resolve(here, '..', 'dist');
  if (fs.existsSync(dist)) {
    app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '365d', index: false }));
    app.use(express.static(dist, { index: false, maxAge: '1h' }));
    app.get('*', (_req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(dist, 'index.html')); // client-side routing fallback
    });
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
    if (err?.status && err.status < 500) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  });
  return app;
}
