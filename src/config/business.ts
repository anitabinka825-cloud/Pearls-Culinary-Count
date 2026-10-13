import { BusinessConfig } from '../types';

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
