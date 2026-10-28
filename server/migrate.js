import 'dotenv/config';
import { runSchema, closePool } from './db.js';

try {
  await runSchema();
  console.log('Schema applied.');
} catch (e) {
  console.error('Schema failed:', e.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
