import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));

export interface Db {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>;
  connect?: () => Promise<Db & { release: () => void }>;
}

/** Runs fn inside a transaction (all-or-nothing). */
export async function withTx<T>(fn: (tx: Db) => Promise<T>, target: Db = getDb()): Promise<T> {
  if (!target.connect) return fn(target);
  const client = await target.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw e;
  } finally {
    client.release();
  }
}

let db: Db | null = null;

export function setDb(custom: Db) {
  db = custom;
}

export function getDb(): Db {
  if (db) return db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const useSsl = process.env.DATABASE_SSL === 'true';
  db = new pg.Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
  }) as unknown as Db;
  return db;
}

export async function migrate(target: Db = getDb()) {
  const sql = fs.readFileSync(path.join(here, 'schema.sql'), 'utf8');
  await target.query(sql);
  // Seed delivery areas INACTIVE with a zero fee: the owner sets real fees and switches
  // each area on from the admin area, so nobody is ever charged a wrong/free delivery fee.
  const { ACCRA_DELIVERY_AREAS } = await import('../src/config/business.js');
  const areas = ACCRA_DELIVERY_AREAS.filter((a) => !/pickup|other/i.test(a));
  for (const [i, name] of areas.entries()) {
    await target.query(
      'INSERT INTO delivery_zones (name, sort_order) VALUES ($1,$2) ON CONFLICT (name) DO NOTHING',
      [name, i],
    );
  }
}
