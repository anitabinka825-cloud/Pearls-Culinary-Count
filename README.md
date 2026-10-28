# My App

React 18 + Vite + Tailwind frontend, Node/Express API, PostgreSQL (Neon), deployed as a single Render web service.

## Run locally

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: set DATABASE_URL (Neon) and JWT_SECRET at minimum
npm run seed              # creates the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev:all           # web: http://localhost:5173  api: http://localhost:8080
```

Open **http://localhost:5173**. Vite serves the UI and proxies `/api` to Express.
With no `RESEND_API_KEY`, verification / reset emails are **printed in the terminal** instead of sent.
Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Structure

```
server/
  index.js        entry: loads .env, applies schema, starts the server
  app.js          Express setup, security, routes, serves dist/ in production
  config.js       reads env vars in one place
  db.js           pg pool (SSL for Neon), transactions, schema runner
  store.js        ALL SQL queries (routes never write SQL)
  schema.sql      table definitions (idempotent)
  seed.js         seeds the admin user          -> npm run seed
  migrate.js      applies schema.sql manually   -> npm run db:schema
  routes/         auth, users (profile + avatar upload), admin, payments
  middleware/     auth (JWT), upload (Multer), security (helmet, rate limits)
  services/       email (Resend), cloudinary, paystack
src/
  api.js          the ONLY file that calls the backend
  context/        AuthContext (session state)
  pages/ components/ lib/
render.yaml       Render blueprint (build, start, /api/health)
.env.example      every environment variable
```

## Adding a feature

1. Table(s) in `server/schema.sql`
2. Query functions in `server/store.js`
3. Route file in `server/routes/`, mounted in `server/app.js`
4. Method in `src/api.js`, then use it from a page/component

## Deploy to Render

1. Push to GitHub, then Render -> New -> Blueprint, pick the repo (reads `render.yaml`).
2. Fill the `sync: false` variables in the dashboard: `APP_URL` (your Render URL), `DATABASE_URL`, Cloudinary, Resend, Paystack.
3. `VITE_*` variables are baked in at **build** time - changing one needs a redeploy.
4. Run `npm run seed` once against production (Render Shell, or locally with the production `DATABASE_URL`).
5. Paystack webhook URL: `https://YOUR-APP.onrender.com/api/webhooks/paystack`
6. After testing, set `CSP_MODE=enforce`.

## Removing Paystack (if the app has no payments)

Delete: `server/routes/payments.js`, `server/services/paystack.js`, `src/lib/paystack.js`, `src/components/PayButton.jsx`;
remove the payments lines in `server/app.js`, `src/api.js`, `src/pages/Dashboard.jsx`, the `payments` table in `schema.sql`,
the Paystack entries in `.env.example` / `render.yaml`, and the paystack hosts in `server/middleware/security.js`.

## Security notes

- Passwords hashed with bcrypt (cost 12); reset/verify tokens are random, single-use, expire, and only their SHA-256 hash is stored.
- The role is read from the database on every request, so demoting/deleting a user takes effect immediately.
- The Paystack amount is decided by the server and re-checked against Paystack's verification (amount + currency) before marking paid; webhooks are HMAC-verified.
- The JWT lives in `localStorage` (simple, but readable by any XSS). If the app handles sensitive data, switch to an httpOnly cookie.
