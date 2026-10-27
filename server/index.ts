import 'dotenv/config';
import { createApp } from './app.js';
import { migrate, getDb } from './db.js';
import { checkProductionEnv } from './security.js';

if (process.env.NODE_ENV === 'production') {
  const { errors, warnings } = checkProductionEnv();
  warnings.forEach((w) => console.warn(`[config] ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`[config] ${e}`));
    console.error('Refusing to start: fix the settings above.');
    process.exit(1);
  }
}

const port = Number(process.env.PORT || 8080);
await migrate();
const server = createApp().listen(port, () => console.log(`Pearls API listening on :${port}`));

// Let in-flight requests (e.g. a payment being verified) finish when the host restarts or redeploys.
let closing = false;
const shutdown = (signal: string) => {
  if (closing) return;
  closing = true;
  console.log(`${signal} received, shutting down`);
  const force = setTimeout(() => process.exit(1), 10_000);
  force.unref();
  server.close(async () => {
    try {
      await (getDb() as any).end?.();
    } finally {
      process.exit(0);
    }
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (e) => console.error('Unhandled rejection', e));
