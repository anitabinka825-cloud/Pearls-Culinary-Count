/**
 * Pearls Culinary Counts — Stage 2A Product & Catalogue Types
 *
 * Designed for clean frontend presentation, accessible filtering,
 * and future seamless mapping to a relational PostgreSQL schema.
 */

export type PricingType =
  | 'FIXED_PRICE'
  | 'FROM_PRICE'
  | 'PRICE_ON_ENQUIRY'
  | 'VARIANT_PRICING';

export type ProductAvailability =
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'MADE_TO_ORDER'
  | 'AVAILABLE_ON_ENQUIRY'
  | 'DISCONTINUED';

// Legacy compatibility type
export type LegacyProductAvailability =
  | 'available_to_order'
  | 'made_to_order'
  | 'in_stock'
  | 'preorder';

export type ProductCategory =
  | 'cakes'
  | 'pastries'
  | 'bread'
  | 'food'
  | 'catering'
  | 'training'
  | 'bags'
  | 'jewellery'
  | 'perfumes'
  /** @deprecated Legacy umbrella category. Canonical categories are bags, jewellery, and perfumes */
  | 'lifestyle';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string; // e.g. "Size", "Flavour", "Filling", "Number of Tiers", "Volume", "Colour"
  values: string[]; // e.g. ["6 inch (serves 8-10)", "8 inch (serves 12-16)"]
}

export interface ProductVariant {
  id: string;
  sku?: string;
  title: string;
  optionValues: Record<string, string>; // e.g. { "Size": "8 inch", "Flavour": "Red Velvet" }
  price?: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  availability?: ProductAvailability;
  image?: string;
  isDefault?: boolean;
}

export interface Product {
  // Canonical identity
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;

  // Taxonomy
  categoryId: ProductCategory | string;
  subcategoryId?: string;
  categoryName: string;
  category: ProductCategory;

  // Media (Canonical: primaryImage & images)
  images: string[];
  primaryImage: string;
  imageAlt: string;

  // Pricing & Inventory (Canonical: price, pricingType, currency)
  price: number | string; // Numeric base price or display string for enquiry
  compareAtPrice?: number;
  currency: string; // e.g. 'GH₵'
  pricingType: PricingType;
  availability: ProductAvailability;
  stockQuantity?: number;
  trackInventory?: boolean;
  madeToOrder?: boolean;
  customizable: boolean;
  featured: boolean;
  tags?: string[];

  // Detailed Specifications & Options (Canonical: specifications, options, variants)
  specifications?: ProductSpecification[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  leadTime?: string;
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
  servings?: string;

  // Timestamps
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp

  // Backward compatibility / convenience fields (NOT independent sources of truth)
  /** @deprecated Legacy alias for primaryImage. Prefer primaryImage or images[0] */
  image?: string;
  /** @deprecated Legacy alias for specifications. Prefer specifications */
  specs?: ProductSpecification[];
  /** @deprecated Derived helper string. Authoritative source is price + pricingType + currency */
  priceFormatted?: string;
  /** @deprecated Derived helper numeric value. Authoritative source is price or variants */
  priceNumeric?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentCategoryId?: string | null;
  active: boolean;
  sortOrder: number;
  itemCount?: number;
  tagline?: string;
  offerings?: string[];
}

export type ProductSortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc';

export interface ProductFilterOptions {
  categoryId?: string;
  subcategoryId?: string;
  availability?: ProductAvailability | 'ALL';
  madeToOrder?: boolean;
  customizable?: boolean;
  featured?: boolean;
  searchQuery?: string;
  sort?: ProductSortOption;
}
