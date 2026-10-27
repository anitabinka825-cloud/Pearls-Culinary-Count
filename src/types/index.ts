export * from './product';
export * from './auth';

export interface CategoryItem {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  itemCount?: string;
  subcategories?: string[];
  offerings?: string[];
  whatsappMessage?: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface ContactInfo {
  businessName: string;
  location: string;
  city: string;
  country: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  whatsappLink: string;
  tagline: string;
  supportingText: string;
}

export interface CustomOrderEnquiry {
  productType: string;
  customProductText?: string;
  quantity: string;
  preferredDate: string;
  size?: string;
  flavour?: string;
  filling?: string;
  themeDesign?: string;
  inscription?: string;
  deliveryLocation: string;
  specialInstructions?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface SocialConfig {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

export interface BusinessConfig {
  name: string;
  shortName: string;
  tagline: string;
  motto: string;
  location: string;
  city: string;
  country: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  whatsappLink: string;
  email?: string;
  socials: SocialConfig;
  features: {
    ecommerceReady: boolean;
    customerAccountsReady: boolean;
    paystackPaymentsReady: boolean;
    sailupSmsReady: boolean;
    orderTrackingReady: boolean;
  };
}

export interface TrainingProgram {
  id: string;
  title: string;
  category: 'Cake Training' | 'Pastry Training' | 'Food Training';
  overview: string;
  highlights: string[];
  suitableFor: string;
  format: string;
}

export type AppRoute =
  | '/'
  | '/shop'
  | '/cakes'
  | '/pastries'
  | '/food'
  | '/training'
  | '/about'
  | '/contact'
  | '/enquiry'
  | '/account'
  | '/admin'
  | '/login'
  | '/register'
  | '/forgot-password'
  | '/cart'
  | '/checkout'
  | `/product/${string}`;

/** What the owner can change from the dashboard; empty strings mean "use the built-in value". */
export interface PublicSiteSettings {
  phone: string; // +233XXXXXXXXX
  whatsapp: string;
  email: string;
  socials: { instagram: string; facebook: string; tiktok: string; youtube: string; x: string };
  careHours: string;
  announcement: string;
  ordersPaused: boolean;
  pauseMessage: string;
}
