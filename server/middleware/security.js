import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      reportOnly: config.cspMode !== 'enforce',
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://js.paystack.co'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'", 'https://api.paystack.co', 'https://checkout.paystack.com'],
        frameSrc: ["'self'", 'https://checkout.paystack.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: config.isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
  });
}

const limiter = (limit, message) =>
  rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false, message: { error: message } });

export const apiLimiter = () => limiter(600, 'Too many requests. Please slow down.');
export const authLimiter = () => limiter(30, 'Too many attempts. Please try again in a few minutes.');
