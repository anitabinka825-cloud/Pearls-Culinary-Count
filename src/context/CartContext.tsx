import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { productRepository } from '../services/productRepository';
import { resolvePurchase } from '../lib/purchasable';

export interface CartItem {
  key: string; // productId|variantId
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantTitle: string;
  image: string;
  unitPricePesewas: number; // display only — the server re-prices every order
  quantity: number;
  minQty: number;
  maxQty: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotalPesewas: number;
  /** Returns an error message, or null on success. */
  addItem: (product: Product, variantId?: string | null, quantity?: number) => string | null;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'pearls.cart.v1';
const CartContext = createContext<CartContextType | undefined>(undefined);

/** Reads the saved cart and re-validates every line against the live catalogue. */
function loadCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const out: CartItem[] = [];
    for (const it of raw) {
      const product = productRepository.getProductById(String(it?.productId));
      const r = resolvePurchase(product, it?.variantId || '');
      if (!r.ok || !product) continue;
      const q = Math.min(r.maxQty, Math.max(r.minQty, Math.floor(Number(it.quantity)) || r.minQty));
      out.push(toItem(product, r, q));
    }
    return out;
  } catch {
    return [];
  }
}

function toItem(product: Product, r: ReturnType<typeof resolvePurchase>, quantity: number): CartItem {
  const variantId = r.variant?.id ?? '';
  return {
    key: `${product.id}|${variantId}`,
    productId: product.id,
    variantId,
    slug: product.slug,
    name: product.name,
    variantTitle: r.variant?.title ?? '',
    image: r.variant?.image || product.primaryImage || product.images?.[0] || '',
    unitPricePesewas: r.unitPricePesewas,
    quantity,
    minQty: r.minQty,
    maxQty: r.maxQty,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* private mode / storage full: cart simply won't persist */
    }
  }, [items]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(loadCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((product: Product, variantId?: string | null, quantity = 1) => {
    const r = resolvePurchase(product, variantId);
    if (!r.ok) return r.reason;
    const key = `${product.id}|${r.variant?.id ?? ''}`;
    let error: string | null = null;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      const wanted = (existing?.quantity ?? 0) + Math.max(quantity, r.minQty);
      if (wanted > r.maxQty) {
        error = `You can order at most ${r.maxQty} of this item.`;
        return prev;
      }
      return existing
        ? prev.map((i) => (i.key === key ? { ...i, quantity: wanted } : i))
        : [...prev, toItem(product, r, wanted)];
    });
    return error;
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.min(i.maxQty, Math.max(i.minQty, Math.floor(quantity) || i.minQty)) } : i,
      ),
    );
  }, []);

  const removeItem = useCallback((key: string) => setItems((p) => p.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalPesewas: items.reduce((n, i) => n + i.unitPricePesewas * i.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, setQuantity, removeItem, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
