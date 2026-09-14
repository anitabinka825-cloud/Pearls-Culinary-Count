# Pearls Culinary Counts

**Tagline**: Quality & Elegance  
**Motto**: Beautifully made. Thoughtfully prepared.  
**Location**: Accra, Ghana  
**Phone & WhatsApp**: 0552471271 (+233 55 247 1271) • [wa.me/233552471271](https://wa.me/233552471271)  

---

## 1. Project Purpose

**Pearls Culinary Counts** is an Accra-based culinary and lifestyle enterprise delivering celebration cakes, artisan pastries, fresh bread, savory Ghanaian cuisine, full event catering, culinary masterclasses, and curated lifestyle accessories (handbags, jewellery, and perfumes).

This web application serves as the primary digital storefront and client inquiry portal for Pearls Culinary Counts, enabling customers across Greater Accra to explore curated catalogues, review pricing guides and specifications, submit bespoke cake and catering commissions, and communicate directly with the kitchen and customer care team via WhatsApp.

---

## 2. Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Routing**: `react-router-dom` v7 with clean semantic path routing
- **Styling**: Tailwind CSS with custom brand design tokens:
  - Primary Brand Accent: Hot Pink (`#DE1B76`)
  - Dark Contrast: Charcoal / Black (`#121214`)
  - Subtle Accent: Warm Gold (`#C5A059`)
  - Clean Backgrounds: Off-white and pure white (`#FAFAFA`, `#FFFFFF`)
- **Icons**: `lucide-react`
- **Build System**: Vite

---

## 3. Current Stage 1 Scope

This codebase represents **Stage 1: Production Frontend Foundation**. It focuses on technical stability, responsive design, verified brand identity, and honest customer-facing inquiry flows:

- **Route Architecture**: Real URL pathways including:
  - `/` (Home showcase, signature offerings, category navigation, brand values, training teasers)
  - `/shop` (Curated catalogue with search and category filtering)
  - `/cakes` (Specialty cake portfolio and custom commissions)
  - `/pastries` (Artisan savory pastries, fruit tartlets, and bread)
  - `/food` (Ghanaian delicacies, continental cuisine, and event catering)
  - `/training` (Hands-on culinary workshops and masterclasses)
  - `/about` (Brand story, craft ethos, and Accra operations)
  - `/contact` (Direct phone, WhatsApp, and inquiry form)
  - `/enquiry` (Dedicated bespoke order and commission form)
  - `/product/:id` (Dedicated product detail view with multi-image gallery, lead times, and specifications)
  - `/account`, `/cart`, `/checkout` (Clean Stage 1 previews explaining future activation)
- **Order & Commission Workflow**: Transparent "Continue in WhatsApp" workflow. Customer inputs (desired flavors, portions, preferred future dates, pickup or Accra delivery areas) are formatted directly into a prefilled WhatsApp message addressed to official business lines (`0552471271`).
- **Data Integrity**: Grounded data models without invented testimonials, fake customer reviews, or unverified claims.
- **Image Fallbacks**: Robust image error handling ensuring graceful fallback if external assets fail to load.

---

## 4. Local Development & Deployment

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Local Execution
```bash
# Install dependencies
npm install

# Start local development server on port 3000
npm run dev

# Run TypeScript and linter checks
npm run lint

# Build production bundle
npm run build
```

---

## 5. Render Static Site Deployment & SPA Routing

The application is fully configured for deployment as a **Render Static Site**:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Single-Page Application (SPA) Rewrites**:
  To prevent 404 errors when users directly enter deep URLs (such as `/cakes`, `/food`, `/enquiry`, or `/product/:id`) or refresh the browser, the application provides:
  1. `render.yaml` at the project root with the following route definition:
     ```yaml
     routes:
       - type: rewrite
         source: /*
         destination: /index.html
     ```
  2. `public/_redirects` included in the build output (`/*  /index.html  200`).

### Verified Direct URLs:
All of the following paths resolve cleanly to `index.html` and are handled by `react-router-dom`:
- `/`
- `/shop`
- `/cakes`
- `/pastries`
- `/food`
- `/training`
- `/about`
- `/contact`
- `/enquiry`
- `/account`
- `/cart`
- `/checkout`
- `/product/:id`

---

## 6. Environment-Variable Approach & Security Warning

### Frontend Client-Side Environment
This project in Stage 1 is an entirely client-side application. No Gemini API keys or external secrets are required for the customer storefront to function.

### ⚠️ Security Warning
> **NEVER store secret API keys, payment private keys, or administrative credentials in client-side code or `.env` files exposed to Vite.**
>
> Secret credentials (such as Paystack secret keys, database credentials, or private SMS tokens) must **ONLY** reside in secure server-side environments (`/api/*` routes, Cloud Run environment secrets, or backend microservices). Exposing private keys in client-side bundles creates severe security vulnerabilities.

---

## 7. Stage 1 Demo Catalogue & Delivery Notice

- **Demo Catalogue**: All items, prices, lead times, and mock inventory in `src/data/products.ts` represent a demonstration catalogue for layout and workflow validation. Real-time menu management will activate in Stage 2.
- **Accra Delivery Locations**: Delivery areas listed in `src/config/business.ts` are temporary demonstration areas. Customer pickup in Accra and final delivery availability/fees are confirmed individually upon WhatsApp enquiry.

---

## 8. Future Architecture (Planned for Stage 2)

Stage 2 will introduce backend and transactional infrastructure:
- **Authentication**: Customer account sign-up and order tracking.
- **Persistent Database**: Cloud Firestore or PostgreSQL for menu management, real-time inventory, and order history.
- **Payment Processing**: Direct mobile money (MTN MoMo, Telecel Cash, AT Money) and card payments integrated via Paystack Ghana.
- **Administrative Portal**: Secure kitchen dashboard for managing orders, updating seasonal prices, and managing class enrollment.
- **Automated Notifications**: Order status updates via SMS and email.
