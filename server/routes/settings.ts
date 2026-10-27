import { Router } from 'express';
import { requireAuth, requireAdmin } from '../auth.js';
import {
  DEFAULT_SETTINGS,
  getSiteSettings,
  saveSiteSettings,
  settingsSchema,
  toPublicSettings,
  type SiteSettings,
} from '../settings.js';

export const settingsRouter = Router();
export const adminSettingsRouter = Router();

// Public: the website reads this on load to show current contact details, links and notices.
settingsRouter.get('/', async (_req, res) => {
  res.set('Cache-Control', 'public, max-age=30');
  res.json(toPublicSettings(await getSiteSettings()));
});

adminSettingsRouter.use(requireAuth, requireAdmin);

adminSettingsRouter.get('/', async (_req, res) => {
  res.json(await getSiteSettings());
});

// The dashboard form always sends the whole form, so this replaces all settings at once.
adminSettingsRouter.put('/', async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const data: SiteSettings = { ...DEFAULT_SETTINGS, ...parsed.data };
  await saveSiteSettings(data);
  res.json(data);
});
