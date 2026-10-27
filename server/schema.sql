-- Pearls Culinary Counts — PostgreSQL schema (idempotent; safe to re-run)
CREATE TABLE IF NOT EXISTS customers (
  id            SERIAL PRIMARY KEY,
  firebase_uid  TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  first_name    TEXT NOT NULL DEFAULT '',
  last_name     TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id               SERIAL PRIMARY KEY,
  reference        TEXT UNIQUE NOT NULL,
  customer_id      INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  product_type     TEXT NOT NULL,
  custom_text      TEXT NOT NULL DEFAULT '',
  quantity         TEXT NOT NULL DEFAULT '',
  preferred_date   TEXT NOT NULL DEFAULT '',
  size             TEXT NOT NULL DEFAULT '',
  flavour          TEXT NOT NULL DEFAULT '',
  filling          TEXT NOT NULL DEFAULT '',
  theme_design     TEXT NOT NULL DEFAULT '',
  inscription      TEXT NOT NULL DEFAULT '',
  delivery_location TEXT NOT NULL DEFAULT '',
  special_instructions TEXT NOT NULL DEFAULT '',
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT NOT NULL DEFAULT '',
  status           TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','confirmed','completed','cancelled')),
  admin_notes      TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiries_customer_idx ON enquiries(customer_id);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status, created_at DESC);

CREATE TABLE IF NOT EXISTS delivery_zones (
  id          SERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  fee_pesewas INTEGER NOT NULL DEFAULT 0 CHECK (fee_pesewas >= 0),
  active      BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id                   SERIAL PRIMARY KEY,
  reference            TEXT UNIQUE NOT NULL,
  customer_id          INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment','paid','preparing','ready','out_for_delivery','completed','cancelled')),
  payment_status       TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
  fulfilment           TEXT NOT NULL CHECK (fulfilment IN ('delivery','pickup')),
  zone_id              INTEGER REFERENCES delivery_zones(id) ON DELETE SET NULL,
  zone_name            TEXT NOT NULL DEFAULT '',
  delivery_fee_pesewas INTEGER NOT NULL DEFAULT 0,
  delivery_address     TEXT NOT NULL DEFAULT '',
  subtotal_pesewas     INTEGER NOT NULL,
  total_pesewas        INTEGER NOT NULL,
  customer_name        TEXT NOT NULL,
  customer_phone       TEXT NOT NULL,
  customer_email       TEXT NOT NULL DEFAULT '',
  preferred_date       TEXT NOT NULL DEFAULT '',
  notes                TEXT NOT NULL DEFAULT '',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders(customer_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id                 SERIAL PRIMARY KEY,
  order_id           INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id         TEXT NOT NULL,
  variant_id         TEXT NOT NULL DEFAULT '',
  name               TEXT NOT NULL,
  variant_title      TEXT NOT NULL DEFAULT '',
  unit_price_pesewas INTEGER NOT NULL,
  quantity           INTEGER NOT NULL CHECK (quantity > 0),
  line_total_pesewas INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);

CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reference      TEXT UNIQUE NOT NULL,
  amount_pesewas INTEGER NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'GHS',
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  channel        TEXT NOT NULL DEFAULT '',
  note           TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS payments_order_idx ON payments(order_id);

-- Every SMS we try to send. dedupe_key makes each notification happen at most once
-- (e.g. 'order:PCC-ABC123:paid'), even if a webhook or request is retried.
CREATE TABLE IF NOT EXISTS sms_log (
  id                SERIAL PRIMARY KEY,
  dedupe_key        TEXT UNIQUE NOT NULL,
  kind              TEXT NOT NULL,
  audience          TEXT NOT NULL DEFAULT 'customer' CHECK (audience IN ('customer','owner')),
  recipient         TEXT NOT NULL,
  body              TEXT NOT NULL,
  order_reference   TEXT NOT NULL DEFAULT '',
  enquiry_reference TEXT NOT NULL DEFAULT '',
  state             TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sent','failed','skipped')),
  provider_id       TEXT NOT NULL DEFAULT '',
  delivery_status   TEXT NOT NULL DEFAULT '',
  error             TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sms_log_created_idx ON sms_log(created_at DESC);
CREATE INDEX IF NOT EXISTS sms_log_provider_idx ON sms_log(provider_id);

-- Owner-editable site settings (contact details, social links, announcement, pausing orders). One row.
CREATE TABLE IF NOT EXISTS site_settings (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  data       TEXT NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
