import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';

export const zonesRouter = Router();
export const adminZonesRouter = Router();

const toZone = (r: any) => ({
  id: r.id, name: r.name, feePesewas: r.fee_pesewas, active: r.active, sortOrder: r.sort_order,
});

// Public: only areas the owner has switched on.
zonesRouter.get('/', async (_req, res) => {
  const { rows } = await getDb().query(
    'SELECT * FROM delivery_zones WHERE active = true ORDER BY sort_order, name',
  );
  res.json(rows.map(toZone));
});

adminZonesRouter.use(requireAuth, requireAdmin);

const zoneBody = z.object({
  name: z.string().trim().min(2).max(100),
  feePesewas: z.number().int().min(0).max(10_000_000),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10_000).default(0),
});

adminZonesRouter.get('/', async (_req, res) => {
  const { rows } = await getDb().query('SELECT * FROM delivery_zones ORDER BY sort_order, name');
  res.json(rows.map(toZone));
});

adminZonesRouter.post('/', async (req, res) => {
  const p = zoneBody.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0].message });
  try {
    const { rows } = await getDb().query(
      'INSERT INTO delivery_zones (name, fee_pesewas, active, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [p.data.name, p.data.feePesewas, p.data.active, p.data.sortOrder],
    );
    res.status(201).json(toZone(rows[0]));
  } catch {
    res.status(409).json({ error: 'A delivery area with that name already exists' });
  }
});

adminZonesRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const p = zoneBody.partial().safeParse(req.body);
  if (!Number.isInteger(id) || !p.success) return res.status(400).json({ error: 'Invalid request' });
  const d = p.data;
  const { rows } = await getDb().query(
    `UPDATE delivery_zones SET name=COALESCE($1,name), fee_pesewas=COALESCE($2,fee_pesewas),
       active=COALESCE($3,active), sort_order=COALESCE($4,sort_order), updated_at=now()
     WHERE id=$5 RETURNING *`,
    [d.name ?? null, d.feePesewas ?? null, d.active ?? null, d.sortOrder ?? null, id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Delivery area not found' });
  res.json(toZone(rows[0]));
});

adminZonesRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid request' });
  await getDb().query('DELETE FROM delivery_zones WHERE id=$1', [id]);
  res.status(204).end();
});
