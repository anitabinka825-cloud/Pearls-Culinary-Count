import type { Request, Response } from 'express';
import { getDb } from '../db.js';
import { verifySailupSignature } from '../sailup.js';

const OUTCOMES = ['delivered', 'failed', 'expired', 'rejected'];

/**
 * Sailup tells us when a message reaches a final outcome. Registered with express.raw() BEFORE the JSON
 * parser because the signature covers the exact bytes. Setting a status is idempotent, so Sailup's
 * retries are harmless. Anything unsigned is refused.
 */
export async function sailupWebhook(req: Request, res: Response) {
  const raw: Buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from('');
  const ok = verifySailupSignature(
    raw,
    String(req.headers['x-sailup-signature'] || ''),
    String(req.headers['x-sailup-timestamp'] || ''),
    process.env.SAILUP_WEBHOOK_SECRET || '',
  );
  if (!ok) return res.status(401).end();

  try {
    const event = JSON.parse(raw.toString('utf8'));
    const status = String(event?.data?.delivery_status || '');
    const id = String(event?.data?.message_id || '');
    if (id && OUTCOMES.includes(status)) {
      await getDb().query(`UPDATE sms_log SET delivery_status=$2, updated_at=now() WHERE provider_id=$1`, [id, status]);
    }
  } catch (e) {
    console.error('Sailup webhook processing failed:', e instanceof Error ? e.message : e);
    return res.status(500).end(); // non-2xx makes Sailup retry
  }
  res.status(200).end();
}
