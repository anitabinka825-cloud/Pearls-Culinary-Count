import { z } from 'zod';
import { getDb } from './db.js';
import { normalizeGhanaPhone } from './validation.js';

/** Everything the owner can change from the dashboard. Empty string = "use the built-in default". */
export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  x: string;
  careHours: string;
  announcement: string;
  ordersPaused: boolean;
  pauseMessage: string;
  ownerAlertPhone: string; // private: never sent to the public site
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: '', whatsapp: '', email: '', instagram: '', facebook: '', tiktok: '', youtube: '', x: '',
  careHours: '', announcement: '', ordersPaused: false, pauseMessage: '', ownerAlertPhone: '',
};

export const DEFAULT_PAUSE_MESSAGE =
  'Online ordering is paused for now. Please message us on WhatsApp or check back soon.';

export async function getSiteSettings(): Promise<SiteSettings> {
  const { rows } = await getDb().query('SELECT data FROM site_settings WHERE id=1');
  if (!rows[0]) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(rows[0].data) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSiteSettings(s: SiteSettings): Promise<void> {
  await getDb().query(
    `INSERT INTO site_settings (id, data) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(s)],
  );
}

/** What the public website may see. Deliberately a short allow-list. */
export function toPublicSettings(s: SiteSettings) {
  return {
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    socials: { instagram: s.instagram, facebook: s.facebook, tiktok: s.tiktok, youtube: s.youtube, x: s.x },
    careHours: s.careHours,
    announcement: s.announcement,
    ordersPaused: s.ordersPaused,
    pauseMessage: s.ordersPaused ? s.pauseMessage || DEFAULT_PAUSE_MESSAGE : '',
  };
}

// ---- Validation ----
const optionalPhone = z
  .string()
  .trim()
  .default('')
  .transform((v, ctx) => {
    if (!v) return '';
    const p = normalizeGhanaPhone(v);
    if (!p) ctx.addIssue({ code: 'custom', message: 'Enter a valid Ghana phone number (or leave it empty)' });
    return p ?? '';
  });

/** Accepts "instagram.com/pearls" or a full link; only https links on the platform's own domain are kept. */
const socialLink = (label: string, hosts: string[]) =>
  z
    .string()
    .trim()
    .max(200)
    .default('')
    .transform((v, ctx) => {
      if (!v) return '';
      let u: URL;
      try {
        u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
      } catch {
        ctx.addIssue({ code: 'custom', message: `Enter a valid ${label} link` });
        return '';
      }
      const host = u.hostname.toLowerCase().replace(/^(www|m|web)\./, '');
      const onPlatform = hosts.some((h) => host === h || host.endsWith(`.${h}`));
      if (!onPlatform || u.username || u.password) {
        ctx.addIssue({ code: 'custom', message: `That doesn't look like a ${label} link` });
        return '';
      }
      u.protocol = 'https:';
      return u.toString();
    });

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`).default('');

export const settingsSchema = z.object({
  phone: optionalPhone,
  whatsapp: optionalPhone,
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email address').max(200)]).default(''),
  instagram: socialLink('Instagram', ['instagram.com']),
  facebook: socialLink('Facebook', ['facebook.com', 'fb.com', 'fb.me']),
  tiktok: socialLink('TikTok', ['tiktok.com']),
  youtube: socialLink('YouTube', ['youtube.com', 'youtu.be']),
  x: socialLink('X', ['x.com', 'twitter.com']),
  careHours: text(120),
  announcement: text(200),
  ordersPaused: z.boolean().default(false),
  pauseMessage: text(200),
  ownerAlertPhone: optionalPhone,
});
