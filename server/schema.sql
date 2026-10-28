-- PostgreSQL schema. Idempotent: safe to run repeatedly.
-- Add new tables below as features are built.

CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL,
  name           TEXT NOT NULL DEFAULT '',
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN NOT NULL DEFAULT false,
  avatar_url     TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Case-insensitive uniqueness for emails.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- One-time tokens for email verification and password reset (only the SHA-256 hash is stored).
CREATE TABLE IF NOT EXISTS auth_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('verify_email', 'reset_password')),
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_tokens_user_idx ON auth_tokens (user_id, type);

-- Paystack payments (remove with the payments feature if not needed).
CREATE TABLE IF NOT EXISTS payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference     TEXT NOT NULL UNIQUE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_minor  INTEGER NOT NULL CHECK (amount_minor > 0), -- pesewas/kobo/cents
  currency      TEXT NOT NULL DEFAULT 'GHS',
  description   TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_user_idx ON payments (user_id, created_at DESC);
