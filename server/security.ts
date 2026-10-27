import type { RequestHandler } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const isProd = () => process.env.NODE_ENV === 'production';

/**
 * Content-Security-Policy for the storefront.
 * Origins are the ones the site really uses: Google Fonts, Unsplash product photos,
 * and Firebase Authentication (email/password + Google pop-up sign-in).
 * CSP_MODE=report-only (default) logs violations in the browser console without blocking;
 * set CSP_MODE=enforce once a full test (browse, sign in with Google, checkout, pay) is clean.
 */
export function cspDirectives() {
  const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN;
  const frames = ["'self'", 'https://accounts.google.com', 'https://*.firebaseapp.com', 'https://*.web.app'];
  if (authDomain && !/firebaseapp\.com$|web\.app$/.test(authDomain)) frames.push(`https://${authDomain}`);
  return {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://apis.google.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://lh3.googleusercontent.com'],
    connectSrc: [
      "'self'",
      'https://identitytoolkit.googleapis.com',
      'https://securetoken.googleapis.com',
      'https://www.googleapis.com',
      'https://firebaseinstallations.googleapis.com',
    ],
    frameSrc: frames,
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'", 'https://checkout.paystack.com'],
    frameAncestors: ["'none'"],
    ...(isProd() ? { upgradeInsecureRequests: [] } : {}),
  };
}

export function securityHeaders(): RequestHandler {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: cspDirectives(),
      reportOnly: (process.env.CSP_MODE || 'report-only') !== 'enforce',
    },
    // Google sign-in opens a pop-up; the default "same-origin" policy would break it.
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProd() ? { maxAge: 15552000, includeSubDomains: true } : false,
  });
}

/** API responses are private by default; routes that are safe to cache (public settings) set their own header. */
export const apiNoStore: RequestHandler = (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};

/** Broad per-IP ceiling for the whole API (individual routes keep their tighter limits). */
export function globalApiLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.API_RATE_LIMIT || 600),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down and try again shortly.' },
  });
}

/** Strict limit on endpoints that take a token or change data while signed in as staff. */
export function adminLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again shortly.' },
  });
}

/**
 * Fails fast at start-up in production if something required is missing,
 * instead of failing later on a customer's checkout.
 */
export function checkProductionEnv(env: NodeJS.ProcessEnv = process.env): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const need = (k: string, why: string) => {
    if (!env[k]?.trim()) errors.push(`${k} is required (${why})`);
  };
  need('DATABASE_URL', 'database connection');
  need('APP_URL', 'return link after payment and email/SMS links');
  need('ADMIN_EMAILS', 'nobody could open the dashboard');
  need('PAYSTACK_SECRET_KEY', 'online payments');
  need('VITE_FIREBASE_PROJECT_ID', 'verifying customer sign-in');
  if (env.APP_URL && !/^https:\/\//i.test(env.APP_URL)) errors.push('APP_URL must start with https:// in production');
  if (env.PAYSTACK_SECRET_KEY?.startsWith('sk_test_')) warnings.push('PAYSTACK_SECRET_KEY is a TEST key: real payments will not work');
  if (!env.SAILUP_API_KEY) warnings.push('SAILUP_API_KEY is not set: SMS will be logged as "not sent"');
  if (!env.SAILUP_WEBHOOK_SECRET) warnings.push('SAILUP_WEBHOOK_SECRET is not set: SMS delivery reports will be rejected');
  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) warnings.push('FIREBASE_SERVICE_ACCOUNT_JSON is not set: using project id only (enough for sign-in checks)');
  if ((env.CSP_MODE || 'report-only') !== 'enforce') warnings.push('CSP_MODE is not "enforce": the content security policy only reports, it does not block');
  return { errors, warnings };
}
