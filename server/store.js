// All SQL lives here. Route handlers call these functions and never write SQL themselves.
import { query, withTx } from './db.js';

/* ---------- helpers ---------- */
export const toPublicUser = (u) =>
  u && {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    emailVerified: u.email_verified,
    avatarUrl: u.avatar_url,
    createdAt: u.created_at,
  };

const toPayment = (p) =>
  p && {
    id: p.id,
    reference: p.reference,
    userId: p.user_id,
    amountMinor: p.amount_minor,
    currency: p.currency,
    description: p.description,
    status: p.status,
    paidAt: p.paid_at,
    createdAt: p.created_at,
  };

/* ---------- users ---------- */
export async function createUser({ email, name = '', passwordHash, role = 'user', emailVerified = false }) {
  const { rows } = await query(
    `INSERT INTO users (email, name, password_hash, role, email_verified)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email.trim(), name.trim(), passwordHash, role, emailVerified],
  );
  return rows[0];
}

export async function getUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE lower(email) = lower($1)', [email.trim()]);
  return rows[0] || null;
}

export async function getUserById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function updateProfile(id, { name }) {
  const { rows } = await query(
    'UPDATE users SET name = $2, updated_at = now() WHERE id = $1 RETURNING *',
    [id, name.trim()],
  );
  return rows[0] || null;
}

export async function setAvatar(id, url) {
  const { rows } = await query(
    'UPDATE users SET avatar_url = $2, updated_at = now() WHERE id = $1 RETURNING *',
    [id, url],
  );
  return rows[0] || null;
}

export async function setPassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1', [id, passwordHash]);
}

export async function markEmailVerified(id) {
  await query('UPDATE users SET email_verified = true, updated_at = now() WHERE id = $1', [id]);
}

export async function listUsers({ limit = 50, offset = 0 } = {}) {
  const { rows } = await query('SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
  const { rows: c } = await query('SELECT count(*)::int AS n FROM users');
  return { users: rows.map(toPublicUser), total: c[0].n };
}

/** Used by seed.js: create the admin, or promote/reset an existing account. */
export async function upsertAdmin({ email, name, passwordHash }) {
  const { rows } = await query(
    `INSERT INTO users (email, name, password_hash, role, email_verified)
     VALUES ($1, $2, $3, 'admin', true)
     ON CONFLICT (lower(email)) DO UPDATE
       SET role = 'admin', email_verified = true, password_hash = EXCLUDED.password_hash, updated_at = now()
     RETURNING *`,
    [email.trim(), name, passwordHash],
  );
  return rows[0];
}

/* ---------- one-time tokens ---------- */
export async function createAuthToken({ userId, type, tokenHash, expiresAt }) {
  await withTx(async (c) => {
    // Invalidate older unused tokens of the same type so only the latest link works.
    await c.query('DELETE FROM auth_tokens WHERE user_id = $1 AND type = $2 AND used_at IS NULL', [userId, type]);
    await c.query(
      'INSERT INTO auth_tokens (user_id, type, token_hash, expires_at) VALUES ($1, $2, $3, $4)',
      [userId, type, tokenHash, expiresAt],
    );
  });
}

/** Atomically marks a valid token as used and returns its user id (or null). */
export async function consumeAuthToken({ type, tokenHash }) {
  const { rows } = await query(
    `UPDATE auth_tokens SET used_at = now()
     WHERE type = $1 AND token_hash = $2 AND used_at IS NULL AND expires_at > now()
     RETURNING user_id`,
    [type, tokenHash],
  );
  return rows[0]?.user_id || null;
}

/* ---------- payments ---------- */
export async function createPayment({ reference, userId, amountMinor, currency, description }) {
  const { rows } = await query(
    `INSERT INTO payments (reference, user_id, amount_minor, currency, description)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [reference, userId, amountMinor, currency, description],
  );
  return toPayment(rows[0]);
}

export async function getPaymentByReference(reference) {
  const { rows } = await query('SELECT * FROM payments WHERE reference = $1', [reference]);
  return toPayment(rows[0]) || null;
}

export async function markPayment(reference, status) {
  const { rows } = await query(
    `UPDATE payments SET status = $2, paid_at = CASE WHEN $2 = 'paid' THEN now() ELSE paid_at END
     WHERE reference = $1 AND status <> 'paid' RETURNING *`,
    [reference, status],
  );
  return toPayment(rows[0]) || null;
}

export async function listPaymentsForUser(userId) {
  const { rows } = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]);
  return rows.map(toPayment);
}
