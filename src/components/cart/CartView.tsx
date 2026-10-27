import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPesewas } from '../../lib/purchasable';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export function CartView() {
  const { items, subtotalPesewas, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const paused = !!settings?.ordersPaused;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAFAFA] px-4 py-16">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF2F7] text-[#DE1B76] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#121214]">Your cart is empty</h1>
          <p className="text-sm text-neutral-600">Browse our cakes, pastries, bread and lifestyle pieces and add your favourites.</p>
          <Link to="/shop" className="inline-block px-6 py-3 rounded-full bg-[#DE1B76] text-white text-sm font-semibold">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] py-10 lg:py-16 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-[#121214] mb-8">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((i) => (
              <li key={i.key} className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex gap-4">
                {i.image && <img src={i.image} alt={i.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${i.slug}`} className="font-semibold text-sm text-neutral-900 hover:text-[#DE1B76]">{i.name}</Link>
                  {i.variantTitle && <p className="text-xs text-neutral-500 mt-0.5">{i.variantTitle}</p>}
                  <p className="text-xs text-neutral-600 mt-1">{formatPesewas(i.unitPricePesewas)} each</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-neutral-200">
                      <button aria-label={`Decrease ${i.name}`} onClick={() => setQuantity(i.key, i.quantity - 1)} className="w-8 h-8 text-neutral-600 hover:text-[#DE1B76]">−</button>
                      <span className="w-7 text-center text-sm font-semibold">{i.quantity}</span>
                      <button aria-label={`Increase ${i.name}`} onClick={() => setQuantity(i.key, i.quantity + 1)} className="w-8 h-8 text-neutral-600 hover:text-[#DE1B76]">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{formatPesewas(i.unitPricePesewas * i.quantity)}</span>
                      <button aria-label={`Remove ${i.name}`} onClick={() => removeItem(i.key)} className="text-neutral-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="bg-white rounded-2xl border border-neutral-200/80 p-6 h-fit space-y-4">
            <h2 className="font-bold text-neutral-900">Order summary</h2>
            <div className="flex justify-between text-sm"><span className="text-neutral-600">Subtotal</span><span className="font-semibold">{formatPesewas(subtotalPesewas)}</span></div>
            <p className="text-xs text-neutral-500">Delivery fees are added at checkout based on your area. Pickup is free.</p>
            {paused && <p role="status" className="rounded-xl bg-amber-50 text-amber-800 text-xs p-3">{settings!.pauseMessage}</p>}
            <button disabled={paused} onClick={() => navigate('/checkout')} className="w-full py-3 rounded-full bg-[#DE1B76] hover:bg-[#B8125C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold">Proceed to checkout</button>
            <Link to="/shop" className="block text-center text-xs font-semibold text-neutral-600 hover:text-[#DE1B76]">Continue shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
