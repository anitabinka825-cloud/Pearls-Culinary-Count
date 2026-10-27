import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { getDb, withTx } from '../db.js';
import { requireAuth } from '../auth.js';
import { phoneSchema } from '../validation.js';
import { findProduct } from '../catalog.js';
import { getSiteSettings, DEFAULT_PAUSE_MESSAGE } from '../settings.js';
import { resolvePurchase } from '../../src/lib/purchasable.js';

export const ordersRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many orders. Please try again shortly.' },
});

const todayAccra = () => new Date().toISOString().slice(0, 10); // Accra is UTC+0 year-round

export const orderSchema = z
  .object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1).max(100),
          variantId: z.string().max(100).optional().nullable(),
          quantity: z.number().int().min(1).max(50),
        }),
      )
      .min(1, 'Your cart is empty')
      .max(30),
    fulfilment: z.enum(['delivery', 'pickup']),
    zoneId: z.number().int().optional().nullable(),
    deliveryAddress: z.string().trim().max(500).default(''),
    preferredDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date')
      .refine((d) => d >= todayAccra(), 'Choose today or a future date'),
    customerName: z.string().trim().min(2, 'Name is required').max(120),
    customerPhone: phoneSchema,
    notes: z.string().trim().max(1000).default(''),
  })
  .superRefine((v, ctx) => {
    if (v.fulfilment === 'delivery') {
      if (!v.zoneId) ctx.addIssue({ code: 'custom', message: 'Choose a delivery area', path: ['zoneId'] });
      if (v.deliveryAddress.length < 5)
        ctx.addIssue({ code: 'custom', message: 'Enter your delivery address', path: ['deliveryAddress'] });
    }
  });

export const toOrder = (r: any, items: any[] = []) => ({
  id: r.id,
  reference: r.reference,
  status: r.status,
  paymentStatus: r.payment_status,
  fulfilment: r.fulfilment,
  zoneName: r.zone_name,
  deliveryFeePesewas: r.delivery_fee_pesewas,
  deliveryAddress: r.delivery_address,
  subtotalPesewas: r.subtotal_pesewas,
  totalPesewas: r.total_pesewas,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  preferredDate: r.preferred_date,
  notes: r.notes,
  createdAt: r.created_at,
  items: items.map((i) => ({
    productId: i.product_id,
    variantId: i.variant_id,
    name: i.name,
    variantTitle: i.variant_title,
    unitPricePesewas: i.unit_price_pesewas,
    quantity: i.quantity,
    lineTotalPesewas: i.line_total_pesewas,
  })),
});

const newReference = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'PCC-' + Array.from(crypto.randomBytes(6), (b) => alphabet[b % alphabet.length]).join('');
};

// Prices, availability and delivery fees are ALL decided here — nothing from the browser is trusted.
ordersRouter.post('/', requireAuth, limiter, async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const d = parsed.data;

  // The owner can pause online ordering (holiday, fully booked). Enquiries stay open.
  const site = await getSiteSettings();
  if (site.ordersPaused) return res.status(409).json({ error: site.pauseMessage || DEFAULT_PAUSE_MESSAGE });

  // Merge duplicate lines so quantity limits can't be bypassed by splitting.
  const merged = new Map<string, { productId: string; variantId: string; quantity: number }>();
  for (const it of d.items) {
    const key = `${it.productId}|${it.variantId ?? ''}`;
    const cur = merged.get(key);
    if (cur) cur.quantity += it.quantity;
    else merged.set(key, { productId: it.productId, variantId: it.variantId ?? '', quantity: it.quantity });
  }

  const lines: any[] = [];
  let subtotal = 0;
  for (const it of merged.values()) {
    const product = findProduct(it.productId);
    const r = resolvePurchase(product, it.variantId);
    if (!r.ok) return res.status(400).json({ error: `${product?.name ?? 'An item'}: ${r.reason}` });
    if (it.quantity < r.minQty || it.quantity > r.maxQty) {
      return res.status(400).json({
        error: `${product!.name}: quantity must be between ${r.minQty} and ${r.maxQty}`,
      });
    }
    const lineTotal = r.unitPricePesewas * it.quantity;
    subtotal += lineTotal;
    lines.push({
      productId: product!.id,
      variantId: r.variant?.id ?? '',
      name: product!.name,
      variantTitle: r.variant?.title ?? '',
      unit: r.unitPricePesewas,
      quantity: it.quantity,
      lineTotal,
    });
  }

  let zone: any = null;
  if (d.fulfilment === 'delivery') {
    const { rows } = await getDb().query('SELECT * FROM delivery_zones WHERE id=$1 AND active=true', [d.zoneId]);
    zone = rows[0];
    if (!zone) return res.status(400).json({ error: 'That delivery area is not available. Please choose another.' });
  }
  const fee = zone ? zone.fee_pesewas : 0;

  const order = await withTx(async (tx) => {
    const { rows } = await tx.query(
      `INSERT INTO orders (reference, customer_id, fulfilment, zone_id, zone_name, delivery_fee_pesewas,
         delivery_address, subtotal_pesewas, total_pesewas, customer_name, customer_phone, customer_email,
         preferred_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [newReference(), req.user!.id, d.fulfilment, zone?.id ?? null, zone?.name ?? '', fee,
       d.fulfilment === 'delivery' ? d.deliveryAddress : '', subtotal, subtotal + fee,
       d.customerName, d.customerPhone, req.user!.email, d.preferredDate, d.notes],
    );
    const o = rows[0];
    const saved: any[] = [];
    for (const l of lines) {
      const r = await tx.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, name, variant_title,
           unit_price_pesewas, quantity, line_total_pesewas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [o.id, l.productId, l.variantId, l.name, l.variantTitle, l.unit, l.quantity, l.lineTotal],
      );
      saved.push(r.rows[0]);
    }
    return toOrder(o, saved);
  });
  res.status(201).json(order);
});

ordersRouter.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await getDb().query(
    'SELECT * FROM orders WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 100',
    [req.user!.id],
  );
  res.json(rows.map((r) => toOrder(r)));
});

ordersRouter.get('/:reference', requireAuth, async (req, res) => {
  const { rows } = await getDb().query('SELECT * FROM orders WHERE reference=$1', [req.params.reference]);
  const o = rows[0];
  // Same response for "missing" and "someone else's" so references can't be probed.
  if (!o || (o.customer_id !== req.user!.id && req.user!.role !== 'admin')) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const items = await getDb().query('SELECT * FROM order_items WHERE order_id=$1 ORDER BY id', [o.id]);
  res.json(toOrder(o, items.rows));
});
