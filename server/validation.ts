import { z } from 'zod';

/** Accepts 0551234567, 551234567, +233551234567, 233551234567; returns +233XXXXXXXXX. */
export function normalizeGhanaPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, '');
  const m = digits.match(/^(?:\+?233|0)?(\d{9})$/);
  return m ? `+233${m[1]}` : null;
}

export const phoneSchema = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const p = normalizeGhanaPhone(v);
    if (!p) ctx.addIssue({ code: 'custom', message: 'Enter a valid Ghana phone number' });
    return p ?? '';
  });

const short = (max = 200) => z.string().trim().max(max).default('');

export const enquirySchema = z.object({
  productType: z.string().trim().min(1, 'Product type is required').max(120),
  customProductText: short(300),
  quantity: short(60),
  preferredDate: short(40),
  size: short(120),
  flavour: short(120),
  filling: short(120),
  themeDesign: short(1000),
  inscription: short(200),
  deliveryLocation: short(200),
  specialInstructions: short(2000),
  customerName: z.string().trim().min(2, 'Name is required').max(120),
  customerPhone: phoneSchema,
  customerEmail: z.union([z.literal(''), z.string().trim().email().max(200)]).default(''),
});

export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: phoneSchema,
});

export const ENQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'] as const;
export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
});
