import { BusinessConfig, PublicSiteSettings } from '../types';

export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'Pearls Culinary Counts',
  shortName: 'Pearls',
  tagline: 'Quality & Elegance',
  motto: 'Beautifully made. Thoughtfully prepared.',
  location: 'Accra, Ghana',
  city: 'Accra',
  country: 'Ghana',
  phone: '0552471271',
  phoneFormatted: '055 247 1271',
  whatsappNumber: '+233552471271',
  whatsappLink: 'https://wa.me/233552471271',
  email: '', // Not verified - phone and WhatsApp are primary contact channels in Accra
  socials: {
    whatsapp: 'https://wa.me/233552471271',
    // In Stage 2A, social media channels are configured directly by the business owner
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    x: '',
  },
  features: {
    ecommerceReady: false,
    customerAccountsReady: false,
    paystackPaymentsReady: false,
    sailupSmsReady: false,
    orderTrackingReady: false,
  },
};

const BUILT_IN: BusinessConfig = JSON.parse(JSON.stringify(BUSINESS_CONFIG));

const toLocalPhone = (e164: string) => '0' + e164.replace(/\D/g, '').slice(-9);
const prettyPhone = (local: string) => `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;

/**
 * Applies the owner's dashboard settings on top of the built-in details. Many components read
 * BUSINESS_CONFIG directly, so it is updated in place (and the app re-renders from SiteSettingsContext).
 * Always starts from the built-in values, so clearing a field in the dashboard restores the default.
 */
export function applySiteSettings(s: PublicSiteSettings): void {
  const b = BUSINESS_CONFIG;
  b.phone = s.phone ? toLocalPhone(s.phone) : BUILT_IN.phone;
  b.phoneFormatted = s.phone ? prettyPhone(b.phone) : BUILT_IN.phoneFormatted;
  // WhatsApp follows its own number, else the phone number, else the built-in one.
  const wa = (s.whatsapp || s.phone).replace(/\D/g, '');
  b.whatsappNumber = wa ? `+${wa}` : BUILT_IN.whatsappNumber;
  b.whatsappLink = wa ? `https://wa.me/${wa}` : BUILT_IN.whatsappLink;
  b.email = s.email || BUILT_IN.email;
  b.socials = {
    ...BUILT_IN.socials,
    whatsapp: b.whatsappLink,
    instagram: s.socials.instagram || BUILT_IN.socials.instagram,
    facebook: s.socials.facebook || BUILT_IN.socials.facebook,
    tiktok: s.socials.tiktok || BUILT_IN.socials.tiktok,
    youtube: s.socials.youtube || BUILT_IN.socials.youtube,
    x: s.socials.x || BUILT_IN.socials.x,
  };
}

export const createWhatsAppUrl = (customText?: string): string => {
  const defaultMessage = `Hello ${BUSINESS_CONFIG.name}, I would like to make an enquiry or place an order.`;
  const message = customText ? encodeURIComponent(customText) : encodeURIComponent(defaultMessage);
  return `${BUSINESS_CONFIG.whatsappLink}?text=${message}`;
};

// Temporary Stage 2A demonstration locations. Final delivery areas and fees will be managed by the Admin Dashboard.
export const ACCRA_DELIVERY_AREAS = [
  'Customer Pickup in Accra',
  'Airport Residential',
  'East Legon',
  'Cantonments',
  'Labone',
  'Osu',
  'Dzorwulu',
  'Ridge',
  'Roman Ridge',
  'Spintex Road',
  'Tema',
  'Madina',
  'Adenta',
  'Achimota',
  'Dansoman',
  'Sakumono',
  'Other Accra Location (Specify in notes)',
];

export const ACCRA_DELIVERY_LOCATIONS = ACCRA_DELIVERY_AREAS;

export const formatGHS = (amount?: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Price on enquiry';
  }
  return `GH₵ ${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
