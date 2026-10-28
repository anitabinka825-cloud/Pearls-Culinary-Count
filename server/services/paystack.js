import crypto from 'node:crypto';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

const API = 'https://api.paystack.co';

/** Asks Paystack (using the SECRET key) whether a transaction really succeeded. */
export async function verifyTransaction(reference) {
  if (!config.paystack.secretKey) throw new HttpError(503, 'Payments are not configured yet.');
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${config.paystack.secretKey}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.status) throw new HttpError(502, body.message || 'Could not verify payment with Paystack.');
  return body.data; // { status: 'success' | 'failed' | 'abandoned', amount, currency, ... }
}

/** Paystack signs webhooks with HMAC-SHA512 of the raw body using your secret key. */
export function isValidWebhookSignature(rawBody, signature) {
  if (!config.paystack.secretKey || !signature) return false;
  const expected = crypto.createHmac('sha512', config.paystack.secretKey).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
