# Pearls Culinary Counts

**Tagline**: Quality & Elegance  
**Motto**: Beautifully made. Thoughtfully prepared.  
**Location**: Accra, Ghana  
**Phone & WhatsApp**: 0552471271 (+233 55 247 1271) • [wa.me/233552471271](https://wa.me/233552471271)  
**Current Architecture Status**: **Stage 3 — Customer Accounts & Authentication**

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

## 3. Current Stage Scope (Stage 3 — Customer Accounts & Authentication)

This codebase represents **Stage 3: Customer Accounts & Authentication**. It integrates robust, production-structured customer authentication and account management on top of the completed Stage 2A catalogue foundation:

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

The following capabilities are planned for subsequent development stages and are **NOT** part of the current Stage 3 codebase:
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
