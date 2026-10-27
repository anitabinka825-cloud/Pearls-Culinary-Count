import { Router } from 'express';
import { getDb } from '../db.js';
import { requireAuth } from '../auth.js';
import { profileSchema } from '../validation.js';

export const meRouter = Router();

const toProfile = (r: any) => ({
  id: r.id,
  email: r.email,
  firstName: r.first_name,
  lastName: r.last_name,
  phone: r.phone,
  role: r.role,
  createdAt: r.created_at,
});

meRouter.get('/', requireAuth, async (req, res) => {
  const { rows } = await getDb().query('SELECT * FROM customers WHERE id = $1', [req.user!.id]);
  res.json(toProfile(rows[0]));
});

meRouter.put('/', requireAuth, async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { firstName, lastName, phone } = parsed.data;
  const { rows } = await getDb().query(
    `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, updated_at=now()
     WHERE id=$4 RETURNING *`,
    [firstName, lastName, phone, req.user!.id],
  );
  res.json(toProfile(rows[0]));
});
