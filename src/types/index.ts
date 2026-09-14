export type ProductCategory =
  | 'cakes'
  | 'pastries'
  | 'bread'
  | 'food'
  | 'catering'
  | 'training'
  | 'lifestyle';

export type ProductAvailability =
  | 'available_to_order'
  | 'made_to_order'
  | 'in_stock'
  | 'preorder';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  categoryName: string;
  image: string;
  imageAlt: string;
  images?: string[];
  price: string; // Display price e.g. "Price on enquiry" or "From GH₵ 250"
  priceNumeric?: number; // Optional numeric base price in GHS for future checkout
  priceFormatted?: string; // Formatted price e.g. "GH₵ 350.00"
  salePrice?: number;
  availability: ProductAvailability;
  stock?: number;
  stockQuantity?: number;
  madeToOrder?: boolean;
  leadTime?: string;
  servings?: string;
  storageInfo?: string;
  customizable: boolean;
  featured: boolean;
  tags?: string[];
  specs?: ProductSpec[];
}

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
  | '/cart'
  | '/checkout'
  | `/product/${string}`;
