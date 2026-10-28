// Central place for environment config. Import 'dotenv/config' in entry points BEFORE importing this.
const isProd = process.env.NODE_ENV === 'production';

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  if (isProd) throw new Error('JWT_SECRET must be set in production');
  console.warn('[config] JWT_SECRET not set - using an insecure dev secret.');
  return 'dev-only-insecure-secret-change-me';
}

export const config = {
  isProd,
  port: Number(process.env.PORT || 8080),
  appName: process.env.APP_NAME || 'My App',
  appUrl: (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, ''),
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  cspMode: process.env.CSP_MODE || 'report-only',
  autoMigrate: process.env.AUTO_MIGRATE !== 'false',
  jwt: { secret: jwtSecret(), expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'My App <onboarding@resend.dev>',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'my-app',
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    currency: process.env.PAYSTACK_CURRENCY || 'GHS',
  },
};
