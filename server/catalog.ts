import { SAMPLE_PRODUCTS } from '../src/data/products.js';
import type { Product } from '../src/types/product.js';

/**
 * Server-side catalogue lookup. The catalogue lives in src/data/products.ts and is edited in code.
 * Moving it into PostgreSQL (so the dashboard can edit products) is a later step — only this file
 * and the product editor would change.
 */
export function findProduct(id: string): Product | undefined {
  return SAMPLE_PRODUCTS.find((p) => p.id === id);
}
