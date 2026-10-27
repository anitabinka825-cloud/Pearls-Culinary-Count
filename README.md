# Pearls Culinary Counts

**Tagline**: Quality & Elegance  
**Motto**: Beautifully made. Thoughtfully prepared.  
**Location**: Accra, Ghana  
**Phone & WhatsApp**: 0552471271 (+233 55 247 1271) • [wa.me/233552471271](https://wa.me/233552471271)  
**Current Architecture Status**: **Stage 10 — Security & production deployment (verified locally; Stage 11 audit in progress)**

---

## 1. Project Purpose

**Pearls Culinary Counts** is an Accra-based culinary and lifestyle enterprise delivering celebration cakes, artisan pastries, fresh bread, savory Ghanaian cuisine, full event catering, practical culinary training, and curated lifestyle accessories (structured handbags, pearl jewellery, and signature perfumes).

This web application serves as the primary digital storefront, catalogue exploration portal, customer authentication center, and customer inquiry hub for Pearls Culinary Counts, enabling customers across Greater Accra to explore verified product catalogues, register and manage accounts, verify emails, reset passwords, and communicate directly with the kitchen and customer care team via WhatsApp.

---

## 2. Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: `react-router-dom` 7 (semantic slug routing with legacy ID backwards compatibility)
- **Authentication**: **Firebase Authentication** (Client SDK, Email/Password + Google Sign-In)
- **Styling**: Tailwind CSS with custom brand design tokens:
  - Primary Brand Accent: Hot Pink (`#DE1B76`)
  - Dark Contrast: Charcoal / Black (`#121214`)
  - Subtle Accent: Warm Gold (`#C5A059`)
  - Clean Backgrounds: Off-white and pure white (`#FAFAFA`, `#FFFFFF`)
- **Icons**: `lucide-react`
- **Animations**: `motion`

---

## 3. Customer Accounts & Authentication (Stage 3 — still in place)

Stage 3 added customer accounts & authentication. It integrates robust, production-structured customer authentication and account management on top of the completed Stage 2A catalogue foundation:

- **Firebase Authentication Integration**: Real client-side Firebase Auth initialization supporting Email/Password and Google Sign-In. Validates all required environment variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`).
- **Centralized Authentication Context (`AuthContext`)**: Single authoritative state provider exposing `currentUser`, `userProfile`, loading states, `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `sendPasswordReset`, `sendEmailVerification`, and user reloading.
- **Customer Registration (`/register`)**: Account creation with validation for first name, last name, email, and password confirmation. Persistent customer phone/profile fields beyond Firebase Auth-supported attributes will be implemented with the future backend.
- **Customer Login (`/login`)**: Secure sign-in with error handling, loading states, Google sign-in option, and automatic post-login redirection.
- **Password Recovery (`/forgot-password`)**: Secure password reset email workflow with user-friendly confirmation messages avoiding account enumeration risks.
- **Email Verification**: Real Firebase email verification with status notices, resend verification actions, and refresh verification status triggers.
- **Authenticated Account Dashboard (`/account`)**: Replaces placeholders with a fully realized customer profile manager displaying first name, last name, email identity, phone number (or "Not provided" when not present in Firebase Auth), and upcoming feature placeholders.
- **Protected Route Enforcement (`ProtectedRoute`)**: Reusable route guard redirecting unauthenticated visitors attempting to access `/account` to `/login`, while keeping public catalogue browsing completely open.
- **Header & Navigation Synchronization**: Intelligently adapts between guest state and authenticated state.

---

## 4. Planned Capabilities for Later Stages (Stage 4 & Beyond)

Historical note — these were planned after Stage 3 and are now built (see section 10):
- **Shopping Cart Persistence & Online Checkout**: Persistent cart storage, delivery fee calculations, and online payment gateway integration (Paystack).
- **Order Tracking & Management**: Live order fulfillment tracking and history.
- **Saved Delivery Addresses & Wishlist Persistence**: Persistent saved delivery address books and user wishlists.
- **Backend Database & Admin Dashboard**: PostgreSQL/Cloud SQL backend and administrative management interface.
- **SMS & Automated Notifications**: Sailup SMS gateway and transactional email notifications.

---

## 5. Project File Structure

- `/src/`
  - `App.tsx`: Main routing and layout integration wrapped in `AuthProvider`.
  - `main.tsx`: DOM application entry point.
  - `services/`: `firebase.ts` (Firebase client initialization and environment validation).
  - `context/`: `AuthContext.tsx` (Authoritative authentication state and handlers).
  - `components/`:
    - `auth/`: `ProtectedRoute.tsx` guard component.
    - `layout/`: `Header.tsx`, `Footer.tsx`, `CustomerCareButton.tsx`.
    - `views/`: `HomeView.tsx`, `ShopView.tsx`, `CakesView.tsx`, `PastriesView.tsx`, `FoodView.tsx`, `TrainingView.tsx`, `AboutView.tsx`, `ContactView.tsx`, `EnquiryView.tsx`, `ProductDetailView.tsx`, `LoginView.tsx`, `RegisterView.tsx`, `ForgotPasswordView.tsx`, `AccountView.tsx`, `NotFoundView.tsx`.
    - `products/`: `ProductCard.tsx`, `ProductGrid.tsx`, `ProductDetailModal.tsx`.
  - `config/`: `business.ts` (business profile, contact info, Accra delivery locations).
  - `data/`: `products.ts`, `categories.ts` (sample catalogue foundation).
  - `types/`: TypeScript definitions (`product.ts`, `auth.ts`, `index.ts`).

---

## 6. Routing & Deployment (SPA Rewrites)

- **Single-Page Application (SPA) Rewrites**:
  To ensure direct URL visits and browser refreshes resolve correctly without 404 errors, the application includes:
  1. `render.yaml` at the project root with SPA rewrite rules (`source: /*`, `destination: /index.html`).
  2. `public/_redirects` included in the build output (`/*  /index.html  200`).

### Verified Direct URLs:
- `/` (Home)
- `/shop` (Catalogue Discovery)
- `/cakes` (Celebration & Wedding Cakes)
- `/pastries` (Savory & Sweet Pastries, including Artisan Bread and Loaves)
- `/food` (Ghanaian & Continental Cuisine, including Event Catering & Buffets)
- `/training` (Masterclasses & Workshops)
- `/about` (Brand Story & Heritage)
- `/contact` (Contact & Location Information)
- `/enquiry` (Bespoke Commission Form)
- `/login` (Customer Sign In)
- `/register` (Customer Account Registration)
- `/forgot-password` (Password Recovery)
- `/account` (Authenticated Customer Profile - Protected)
- `/product/:slug` (Canonical Product Detail)
- `/product/id/:id` (Legacy ID Product Detail Compatibility)

---

## 7. Environment Variables & Firebase Configuration

### Required Environment Variables (`.env` / `.env.example`)
To enable Firebase Authentication in production or local development, provide all required variables in your `.env` file (see `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Local Development Setup:
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** with **Email/Password** and **Google** sign-in providers.
3. Register a Web App in your Firebase project settings to obtain your configuration credentials.
4. Copy `.env.example` to `.env` and fill in your Firebase project credentials.
5. Run `npm install` and `npm run dev` to start the development server.

---

## 8. Sample Catalogue & Delivery Notice

- **Sample Catalogue Foundation**: All products, categories, variants, and pricing structures in `src/data/products.ts` and `src/data/categories.ts` serve as the validated sample catalogue.
- **Accra Delivery Locations**: Delivery zones listed in `src/config/business.ts` represent active Accra coverage areas. Customer pickup and final delivery scheduling/fees are confirmed individually via direct WhatsApp enquiry.

---

## 9. Backend (added in Stage 4)

`server/` is an Express + PostgreSQL API that also serves the built site in production.

- `npm run server:dev` — API on :8080 (needs `DATABASE_URL`); `npm run dev` proxies `/api` to it.
- `npm test` — API tests (in-memory Postgres, no external services needed).
- Customers sign in with Firebase; the API verifies the Firebase ID token and stores a profile (names, phone, role) in Postgres.
- **Admin access**: emails listed in `ADMIN_EMAILS` get the `admin` role server-side on sign-in. The role is never taken from the browser.
- Tables are created automatically on start (`server/schema.sql`, idempotent).
- Endpoints so far: `GET/PUT /api/me`, `POST /api/enquiries`, `GET /api/enquiries/mine`, `GET /api/admin/enquiries`, `PATCH /api/admin/enquiries/:id`.

## 10. Stage progress

| Stage | Status |
|---|---|
| 4 Custom orders & enquiries | Done: saved to DB, reference numbers, history in Account, WhatsApp hand-off kept |
| 5 Cart, delivery/pickup, checkout | Done: persistent cart, server-priced orders, admin-set delivery fees, order history. Payment = Stage 6 |
| 6 Paystack | Done: hosted checkout (mobile money + card), server-side verification, signed webhook. Test with test keys before going live |
| 7 Admin dashboard | Done: `/admin` for orders, enquiries, delivery areas, refunds. Product catalogue is still edited in code (`src/data/products.ts`) |
| 8 Sailup SMS | Done: order/enquiry texts, owner alerts, delivery tracking, resend. Needs a registered sender ID and credits before it can send |
| 9 Customer care / social controls | Done: owner edits contact details, social links, care hours, announcement bar, and can pause online orders — all from the dashboard |
| 10 Security & production deployment | Built, not yet verified on a live host: security headers + content-security policy, API rate limits, production start-up checks, graceful shutdown, deep health check, caching rules. Go-live checklist below |
| 11 End-to-end audit | In progress: type-check, 51 server tests and production build pass; findings below |

### Stage 5 notes
- **Buyable online:** items with `FIXED_PRICE`, or `VARIANT_PRICING` with a chosen option, that are `IN_STOCK`/`MADE_TO_ORDER`. Everything else uses the enquiry form. Rule lives in `src/lib/purchasable.ts` and is shared by the site and the server.
- **Prices are set by the server.** The browser only sends product id, option and quantity.
- **Delivery areas** are seeded **inactive at GH₵ 0** so no one is charged a wrong fee. Until the Stage 7 dashboard exists, set them via `PATCH /api/admin/delivery-zones/:id` with `{ "feePesewas": 3500, "active": true }` (signed in as an admin). Money is stored in pesewas (GH₵ 1 = 100).
- New endpoints: `GET /api/delivery-zones`, `POST /api/orders`, `GET /api/orders/mine`, `GET /api/orders/:reference`, admin `GET/POST/PATCH/DELETE /api/admin/delivery-zones`.
- Orders require sign-in. New orders start as `pending_payment`/`unpaid`.

### Stage 6 notes — Paystack
1. In Paystack → Settings → API Keys, copy the **test secret key** into `PAYSTACK_SECRET_KEY` (server env only). The public key is not needed: customers are redirected to Paystack's hosted checkout.
2. In Paystack → Settings → API Keys & Webhooks set the **Webhook URL** to `https://YOUR-DOMAIN/api/webhooks/paystack`.
3. Set `APP_URL` to your public site address so customers return to their order page after paying.
4. Flow: order page → `POST /api/orders/:ref/pay` (server sets amount/email, GHS, pesewas) → Paystack → back to `/order/:ref` → `POST /api/orders/:ref/verify`. The webhook is a second, independent path to the same idempotent settlement.
5. An order becomes paid **only** when Paystack's own verify API reports success with the exact amount and currency we asked for. Webhook bodies and return URLs are never trusted on their own.
6. If a customer pays twice, the order is credited once and the extra payment is flagged `duplicate_payment_needs_refund` in the `payments` table for you to refund in the Paystack dashboard.
7. Go live: swap in the live secret key (`sk_live_…`) once Paystack has activated your business, and re-run a small real payment end to end.

### Stage 7 notes — Admin dashboard
- Sign in with an email listed in `ADMIN_EMAILS`; a **Dashboard** button appears in the header (also at `/admin`). Access is enforced by the API on every call — hiding the button is only cosmetic.
- **Overview**: orders to work on, new enquiries, paid total for the last 30 days, refunds to process, and any customers who paid twice.
- **Orders**: filter/search, see items, contact (call / WhatsApp), pickup or delivery details, and move an order through `paid → preparing → ready → (out for delivery) → completed`. Orders can't be marked paid by hand — only a verified Paystack payment does that.
- **Cancelling** an unpaid order also closes it to payment (a late payment is then flagged for refund rather than reviving the order). Cancelling a paid order shows *Refund needed*; refund in the Paystack dashboard, then press **I've refunded this order**. The dashboard does not move money itself.
- **Enquiries**: change status and keep private notes. **Delivery areas**: set fees and switch areas on/off (this replaces the manual `PATCH` from Stage 5).
- New endpoints (admin only): `GET /api/admin/summary`, `GET /api/admin/orders[?status=active|<status>&q=]`, `GET|PATCH /api/admin/orders/:reference`, `GET /api/admin/payments/flagged`, `POST /api/admin/payments/:id/refunded`.
- Not in this stage: editing products/prices from the dashboard (catalogue stays in code) and customer-facing order status notifications (Stage 8 SMS).

### Stage 8 notes — Sailup SMS
**What gets texted** (customer unless noted; all sent once only):
- Payment received · order ready (pickup or delivery wording) · out for delivery · order cancelled after payment · refund issued
- Enquiry received
- *You*, if `SMS_OWNER_PHONE` is set: every new paid order and every new enquiry

Cancelling an order that was never paid sends nothing. Texts are transactional (each follows something the customer just did). There are no marketing texts in this stage.

**Setting it up (do step 1 first — it is the only one that waits on someone else):**
1. In Sailup, register a **sender ID** (your brand name) and wait for approval. Create a project and buy credits (₵0.02 per 160-character text, paid by card or mobile money).
2. In Sailup → Developer Settings create an API key. Set `SAILUP_API_KEY` and `SAILUP_SENDER_ID` on the server.
3. In Sailup, add a webhook pointing to `https://YOUR-DOMAIN/api/webhooks/sailup`, then put the secret it shows (once!) in `SAILUP_WEBHOOK_SECRET`.
4. Optional: `SMS_OWNER_PHONE=0552471271` for your own alerts. Open the dashboard → **Text messages** to see credits and delivery.

**Behaviour to know about**
- **Safe by design:** an SMS problem never fails a payment, order or enquiry. Every message is saved in `sms_log`; if Sailup is unconfigured, out of credits or down, it shows as *Not sent / Could not send* in the dashboard with a **Send again** button.
- **Delivery tracking:** Sailup's signed webhook (checked with HMAC-SHA256) marks messages Delivered / Not delivered. Unsigned requests are rejected.
- **Credits:** the dashboard shows your balance and warns when it is under 50 with auto top-up off. Auto top-up is switched on in the Sailup dashboard (needs a saved card).
- **Cost:** messages are rewritten to stay in the plain GSM-7 alphabet, because a single ₵, curly quote or emoji makes Sailup count 70 characters per segment instead of 160. Amounts are therefore written `GHS 90.00`. Every template is tested to fit one segment.
- **Sailup limits that shape the product:** no scheduling (so no automatic "your order is tomorrow" reminders yet — that would need a daily job on our side), no inbound SMS (customers can't reply by text; messages point them to the phone number), no sender-ID-less sending.
- Endpoints (admin): `GET /api/admin/sms`, `GET /api/admin/sms/credits`, `POST /api/admin/sms/:id/resend`. Webhook: `POST /api/webhooks/sailup`.

### Stage 9 notes — Customer care & site controls
Dashboard → **Site settings** (admin only). Changes apply to the live site within about a minute, with no redeploy. Leaving a field empty uses the built-in value from `src/config/business.ts`.
- **Contact details:** phone, WhatsApp (falls back to the phone number), email, customer-care hours. They update everywhere they appear: header, footer, Contact page, customer-care window, WhatsApp buttons and links.
- **Social links:** Instagram, Facebook, TikTok, YouTube, X. Icons appear only for links that are set. Links must be on the platform's own website (look-alike domains, `javascript:` and links with embedded logins are rejected); `http://` is upgraded to `https://`.
- **Announcement bar:** one short notice across the top of every page.
- **Pause online orders:** blocks checkout with your message (shown in the cart and checkout, and enforced by the server so it can't be bypassed). Enquiries, browsing and payment of orders already placed are unaffected.
- **Your alerts:** the phone that receives new-order and new-enquiry texts (overrides `SMS_OWNER_PHONE`). It is private and never sent to the website.
- **How it works:** one `site_settings` row; public `GET /api/settings` (a short allow-list of fields); admin `GET/PUT /api/admin/settings`. The site loads the settings on start and, if the API is unreachable, simply keeps its built-in details. Texts to customers also quote your current phone number.
- Not included: per-day opening-hours logic ("open now / closed now") — hours are shown as text you write.

### Stage 10 notes — Security & production deployment
**What changed**
- **Security headers** (`server/security.ts`): content-security policy, `X-Content-Type-Options`, strict referrer policy, HSTS in production, no `X-Powered-By`, and `Cross-Origin-Opener-Policy: same-origin-allow-popups` (the Helmet default would break the Google sign-in pop-up).
- **Content-security policy** allows only: this site, Google Fonts, Unsplash photos, Firebase sign-in (Google APIs, `apis.google.com`, `*.firebaseapp.com`), and Paystack checkout as a form target. It ships in **report-only** mode (`CSP_MODE=report-only`): problems show in the browser console but nothing is blocked. Move to `enforce` after the checklist.
- **Rate limits:** a broad per-IP ceiling on the API (`API_RATE_LIMIT`, default 600 per 15 minutes) and 300 per 15 minutes on `/api/admin`, on top of the tighter limits already on orders, payments and enquiries. Webhooks are not limited.
- **Caching:** API responses are `no-store` (public settings keep their 30-second cache); hashed `/assets/*` files cache for a year; `index.html` is never cached, so a new deploy shows straight away.
- **Start-up checks:** with `NODE_ENV=production` the server refuses to start if `DATABASE_URL`, `APP_URL` (must be `https://`), `ADMIN_EMAILS`, `PAYSTACK_SECRET_KEY` or `VITE_FIREBASE_PROJECT_ID` is missing, and prints warnings for a test Paystack key, missing Sailup settings, or a non-enforcing CSP.
- **Operations:** `GET /api/health` (quick) and `/api/health?deep=1` (also asks the database). The server finishes in-flight requests and closes the database cleanly on redeploy.
- **Render blueprint:** web service is on the paid **starter** plan so it stays awake (the free plan sleeps when idle and the first visitor waits for it to wake). The database plan is `basic-256mb`; check Render's current prices before creating them.

**Go-live checklist**
1. Create the blueprint on Render, then fill every variable marked `sync: false`. Use `https://` for `APP_URL`.
2. Firebase console → Authentication → Settings → **Authorized domains**: add your live domain (Google sign-in fails without it).
3. Paystack: set the webhook to `https://YOUR-DOMAIN/api/webhooks/paystack`; keep the `sk_test_` key until a test payment works, then switch to `sk_live_` and make one small real payment.
4. Sailup: sender ID approved, credits bought, webhook set (see Stage 8).
5. Sign in as an admin (an email in `ADMIN_EMAILS`) and open `/admin`; then set delivery fees and switch areas on.
6. **Test with the browser console open** (Network/Console tab): browse, register, sign in with email *and* with Google, add to cart, check out, pay, open the order page. Any "Content Security Policy" message means an origin is missing from `cspDirectives()` in `server/security.ts`.
7. When the console is clean, set `CSP_MODE=enforce` and redeploy; repeat step 6 once.
8. Custom domain: add it in Render, then update `APP_URL`, the Firebase authorized domain and the Paystack webhook to match.

**Known gaps (for the Stage 11 audit)**
- Database backups: rely on the host's backups; restore has not been tested.
- Product photos load from Unsplash; self-host the final photos before launch (and tighten `imgSrc`).
- ~~Server tests for this stage could not be run~~ — now run: `npm run lint`, `npm test` (51 passing) and `npm run build` all succeed.

### Stage 11 notes — audit so far
**Fixed**
- `@types/react` / `@types/react-dom` were missing from `devDependencies`, so `npm run lint` failed on `key` props in the dashboard. Added.
- `PUT /api/admin/settings` now merges the validated form over `DEFAULT_SETTINGS` (type error, no behaviour change).
- `public/favicon.jpg` (also the social-share image) was 880 KB; now 512 px.

**Still open**
- Hero and brand images in `src/assets/images/` are each ~0.9 MB — compress before launch.
- JS bundle is ~760 KB (189 KB gzipped); consider route-level code-splitting.
- `og:image` / `twitter:image` use a relative path; social sites need an absolute `https://` URL.
- 93 product photos are hotlinked from Unsplash (self-host, then tighten `imgSrc`).
- Backups and restore are untested; CSP is still `report-only`; nothing has been run on a live host yet.
