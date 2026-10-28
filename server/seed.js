// Seeds (or resets) the initial admin user. Run: npm run seed
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { runSchema, closePool } from './db.js';
import { upsertAdmin } from './store.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Admin';

try {
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
  if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
  await runSchema();
  const admin = await upsertAdmin({ email, name, passwordHash: await bcrypt.hash(password, 12) });
  console.log(`Admin ready: ${admin.email} (id ${admin.id})`);
} catch (e) {
  console.error('Seed failed:', e.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
