import 'dotenv/config'; // must be first so env vars exist before other modules read them
import { config } from './config.js';
import { createApp } from './app.js';
import { runSchema, closePool } from './db.js';

if (config.autoMigrate) {
  try {
    await runSchema();
  } catch (e) {
    console.error('[db] Could not apply schema:', e.message);
    console.error('     Check DATABASE_URL in .env (and that your Neon project is awake).');
    process.exit(1);
  }
}

const server = createApp().listen(config.port, () => console.log(`API listening on http://localhost:${config.port}`));

let closing = false;
const shutdown = (signal) => {
  if (closing) return;
  closing = true;
  console.log(`${signal} received, shutting down`);
  setTimeout(() => process.exit(1), 10_000).unref();
  server.close(async () => {
    await closePool().catch(() => {});
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));
