import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db.js';
import { optionalAuth, requireAuth, requireAdmin } from '../auth.js';
import { notifyEnquiryReceived } from '../notify.js';
import { enquirySchema, enquiryUpdateSchema, ENQUIRY_STATUSES } from '../validation.js';

export const enquiriesRouter = Router();
export const adminEnquiriesRouter = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries submitted. Please try again shortly.' },
});

const toEnquiry = (r: any) => ({
  id: r.id,
  reference: r.reference,
  productType: r.product_type,
  customProductText: r.custom_text,
  quantity: r.quantity,
  preferredDate: r.preferred_date,
  size: r.size,
  flavour: r.flavour,
  filling: r.filling,
  themeDesign: r.theme_design,
  inscription: r.inscription,
  deliveryLocation: r.delivery_location,
  specialInstructions: r.special_instructions,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerEmail: r.customer_email,
  status: r.status,
  adminNotes: r.admin_notes,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
// Customers never see internal admin notes.
const toPublicEnquiry = (r: any) => {
  const { adminNotes, ...rest } = toEnquiry(r);
  return rest;
};

const newReference = () => 'ENQ-' + crypto.randomBytes(4).toString('hex').toUpperCase();

// Guests and signed-in customers can submit.
enquiriesRouter.post('/', submitLimiter, optionalAuth, async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const d = parsed.data;
  const { rows } = await getDb().query(
    `INSERT INTO enquiries (reference, customer_id, product_type, custom_text, quantity, preferred_date,
       size, flavour, filling, theme_design, inscription, delivery_location, special_instructions,
       customer_name, customer_phone, customer_email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [newReference(), req.user?.id ?? null, d.productType, d.customProductText, d.quantity, d.preferredDate,
     d.size, d.flavour, d.filling, d.themeDesign, d.inscription, d.deliveryLocation, d.specialInstructions,
     d.customerName, d.customerPhone, d.customerEmail],
  );
  notifyEnquiryReceived({
    reference: rows[0].reference, customerPhone: d.customerPhone, customerName: d.customerName, productType: d.productType,
  });
  res.status(201).json(toPublicEnquiry(rows[0]));
});

enquiriesRouter.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await getDb().query(
    'SELECT * FROM enquiries WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 100',
    [req.user!.id],
  );
  res.json(rows.map(toPublicEnquiry));
});

// ---- Admin ----
adminEnquiriesRouter.use(requireAuth, requireAdmin);

adminEnquiriesRouter.get('/', async (req, res) => {
  const status = String(req.query.status || '');
  const where = (ENQUIRY_STATUSES as readonly string[]).includes(status) ? 'WHERE status=$1' : '';
  const { rows } = await getDb().query(
    `SELECT * FROM enquiries ${where} ORDER BY created_at DESC LIMIT 500`,
    where ? [status] : [],
  );
  res.json(rows.map(toEnquiry));
});

adminEnquiriesRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = enquiryUpdateSchema.safeParse(req.body);
  if (!Number.isInteger(id) || !parsed.success) return res.status(400).json({ error: 'Invalid request' });
  const { status, adminNotes } = parsed.data;
  const { rows } = await getDb().query(
    `UPDATE enquiries SET status=COALESCE($1,status), admin_notes=COALESCE($2,admin_notes), updated_at=now()
     WHERE id=$3 RETURNING *`,
    [status ?? null, adminNotes ?? null, id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Enquiry not found' });
  res.json(toEnquiry(rows[0]));
});
