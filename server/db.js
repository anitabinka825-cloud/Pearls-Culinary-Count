import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
let pool;

export function getPool() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const isLocal = /@(localhost|127\.0\.0\.1)/.test(url);
  pool = new pg.Pool({
    connectionString: url,
    ssl: isLocal ? undefined : { rejectUnauthorized: false }, // Neon requires SSL
    max: 10,
    idleTimeoutMillis: 30_000,
  });
  pool.on('error', (e) => console.error('[db] idle client error:', e.message));
  return pool;
}

export const query = (text, params) => getPool().query(text, params);

/** Runs fn(client) inside a transaction. */
export async function withTx(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

/** Applies schema.sql (idempotent - safe to run on every start). */
export async function runSchema() {
  const sql = fs.readFileSync(path.join(here, 'schema.sql'), 'utf8');
  await query(sql);
}

export async function closePool() {
  if (pool) await pool.end();
  pool = undefined;
}
