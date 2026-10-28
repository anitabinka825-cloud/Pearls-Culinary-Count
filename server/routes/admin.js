import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listUsers } from '../store.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/users', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  res.json(await listUsers({ limit, offset }));
}));

export default router;
