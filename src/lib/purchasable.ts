import type { Product, ProductVariant } from '../types/product';

export interface PurchaseResult {
  ok: boolean;
  /** Why it can't be bought online (empty when ok). */
  reason: string;
  unitPricePesewas: number;
  variant: ProductVariant | null;
  minQty: number;
  maxQty: number;
}

const no = (reason: string): PurchaseResult => ({ ok: false, reason, unitPricePesewas: 0, variant: null, minQty: 1, maxQty: 1 });

const BLOCKED = new Set(['OUT_OF_STOCK', 'DISCONTINUED', 'AVAILABLE_ON_ENQUIRY']);
export const MAX_LINE_QTY = 50;

const toPesewas = (n: number) => Math.round(n * 100);

/**
 * Single source of truth for "can this be added to the cart, and at what price?".
 * Used by the website (to show buttons) AND by the server (to price orders).
 * Only FIXED_PRICE and VARIANT_PRICING products are buyable online; FROM_PRICE and
 * PRICE_ON_ENQUIRY products go through the enquiry form.
 */
export function resolvePurchase(product: Product | undefined, variantId?: string | null): PurchaseResult {
  if (!product) return no('Product not found');
  if (BLOCKED.has(product.availability)) return no('This item is not available to order online');
  if (product.pricingType !== 'FIXED_PRICE' && product.pricingType !== 'VARIANT_PRICING') {
    return no('This item is priced on enquiry');
  }

  let variant: ProductVariant | null = null;
  let price: number | undefined;

  if (product.pricingType === 'VARIANT_PRICING') {
    const variants = product.variants ?? [];
    variant = variantId ? variants.find((v) => v.id === variantId) ?? null : null;
    if (!variant) return no('Please choose an option');
    if (variant.availability && BLOCKED.has(variant.availability)) {
      return no('This option is not available to order online');
    }
    price = variant.price;
  } else {
    price = typeof product.price === 'number' ? product.price : undefined;
  }

  if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
    return no('This item is priced on enquiry');
  }
  return {
    ok: true,
    reason: '',
    variant,
    unitPricePesewas: toPesewas(price),
    minQty: Math.max(1, product.minimumOrderQuantity ?? 1),
    maxQty: Math.min(MAX_LINE_QTY, product.maximumOrderQuantity ?? MAX_LINE_QTY),
  };
}

export const formatPesewas = (p: number) =>
  `GH₵ ${(p / 100).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
