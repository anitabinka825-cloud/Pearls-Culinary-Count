import crypto from 'node:crypto';
import { Router } from 'express';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';
import { createPayment, getPaymentByReference, markPayment, listPaymentsForUser } from '../store.js';
import { verifyTransaction, isValidWebhookSignature } from '../services/paystack.js';
import { HttpError, asyncHandler } from '../utils/http.js';

const router = Router();

/** Confirms with Paystack, checks amount + currency against OUR record, then marks paid. */
async function settle(reference) {
  const payment = await getPaymentByReference(reference);
  if (!payment) throw new HttpError(404, 'Payment not found.');
  if (payment.status === 'paid') return payment;
  const tx = await verifyTransaction(reference);
  const matches = tx.amount === payment.amountMinor && String(tx.currency).toUpperCase() === payment.currency;
  if (tx.status === 'success' && matches) return (await markPayment(reference, 'paid')) || (await getPaymentByReference(reference));
  if (tx.status === 'failed') return (await markPayment(reference, 'failed')) || payment;
  return payment; // still pending / abandoned
}

// The server decides the amount and reference; the browser just opens the Paystack popup with them.
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const amount = Number(req.body?.amount); // major units, e.g. 25.50
  const description = String(req.body?.description || '').slice(0, 200);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) throw new HttpError(400, 'Enter a valid amount.');
  const payment = await createPayment({
    reference: `pay_${crypto.randomBytes(10).toString('hex')}`,
    userId: req.user.id,
    amountMinor: Math.round(amount * 100),
    currency: config.paystack.currency,
    description,
  });
  res.status(201).json({ payment, email: req.user.email });
}));

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  res.json({ payments: await listPaymentsForUser(req.user.id) });
}));

router.get('/verify/:reference', requireAuth, asyncHandler(async (req, res) => {
  const existing = await getPaymentByReference(req.params.reference);
  if (!existing || existing.userId !== req.user.id) throw new HttpError(404, 'Payment not found.');
  res.json({ payment: await settle(req.params.reference) });
}));

/** Webhook handler (mounted in app.js with a RAW body parser, before express.json). */
export const paystackWebhook = asyncHandler(async (req, res) => {
  if (!isValidWebhookSignature(req.body, req.headers['x-paystack-signature'])) return res.sendStatus(401);
  const event = JSON.parse(req.body.toString('utf8'));
  if (event.event === 'charge.success' && event.data?.reference) {
    await settle(event.data.reference).catch((e) => console.error('[paystack] webhook settle failed:', e.message));
  }
  res.sendStatus(200);
});

export default router;
