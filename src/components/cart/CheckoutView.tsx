import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Store, Truck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPesewas } from '../../lib/purchasable';
import { createOrder, getDeliveryZones, DeliveryZone } from '../../services/api';

const today = () => new Date().toISOString().slice(0, 10);
const input = 'w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE1B76]';
const label = 'block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5';

export function CheckoutView() {
  const { items, subtotalPesewas, clear } = useCart();
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [fulfilment, setFulfilment] = useState<'pickup' | 'delivery'>('pickup');
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [zonesLoaded, setZonesLoaded] = useState(false);
  const [zoneId, setZoneId] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const { settings } = useSiteSettings();
  const paused = !!settings?.ordersPaused;
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDeliveryZones().then(setZones).catch(() => setZones([])).finally(() => setZonesLoaded(true));
  }, []);

  // Prefill once the profile arrives, without overwriting what the customer has typed.
  useEffect(() => {
    if (userProfile) {
      setName((n) => n || `${userProfile.firstName} ${userProfile.lastName}`.trim());
      setPhone((p) => p || userProfile.phone || '');
    }
  }, [userProfile]);

  if (items.length === 0 && !busy) return <Navigate to="/cart" replace />;

  const zone = zones.find((z) => z.id === zoneId);
  const fee = fulfilment === 'delivery' && zone ? zone.feePesewas : 0;
  const total = subtotalPesewas + fee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date) return setError('Please choose the date you need your order.');
    if (fulfilment === 'delivery' && !zone) return setError('Please choose a delivery area.');
    setBusy(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || undefined, quantity: i.quantity })),
        fulfilment,
        zoneId: fulfilment === 'delivery' ? (zone!.id) : null,
        deliveryAddress: fulfilment === 'delivery' ? address : '',
        preferredDate: date,
        customerName: name,
        customerPhone: phone,
        notes,
      });
      clear();
      navigate(`/order/${order.reference}`, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Could not place your order. Please try again.');
      setBusy(false);
    }
  };

  const optionCls = (active: boolean) =>
    `flex-1 flex items-center gap-3 p-4 rounded-2xl border text-left text-sm transition-colors ${
      active ? 'border-[#DE1B76] bg-[#FDF2F7]' : 'border-neutral-200 bg-white hover:border-neutral-300'
    }`;

  return (
    <div className="bg-[#FAFAFA] py-10 lg:py-16 min-h-[70vh]">
      <form onSubmit={submit} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h1 className="font-serif text-3xl font-bold text-[#121214]">Checkout</h1>

          <section className="space-y-3">
            <h2 className="font-bold text-neutral-900">1. How would you like to receive your order?</h2>
            <div className="flex flex-col sm:flex-row gap-3" role="radiogroup" aria-label="Fulfilment method">
              <button type="button" role="radio" aria-checked={fulfilment === 'pickup'} onClick={() => setFulfilment('pickup')} className={optionCls(fulfilment === 'pickup')}>
                <Store className="w-5 h-5 text-[#DE1B76]" />
                <span><strong className="block">Pickup in Accra</strong><span className="text-xs text-neutral-500">Free — we confirm the pickup point after payment</span></span>
              </button>
              <button type="button" role="radio" aria-checked={fulfilment === 'delivery'} onClick={() => setFulfilment('delivery')} className={optionCls(fulfilment === 'delivery')}>
                <Truck className="w-5 h-5 text-[#DE1B76]" />
                <span><strong className="block">Delivery</strong><span className="text-xs text-neutral-500">Fee depends on your area</span></span>
              </button>
            </div>

            {fulfilment === 'delivery' && (
              <div className="space-y-3 pt-2">
                {zonesLoaded && zones.length === 0 ? (
                  <p className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    Online delivery isn’t available yet. Please choose pickup, or message us on WhatsApp to arrange delivery.
                  </p>
                ) : (
                  <>
                    <div>
                      <label className={label} htmlFor="zone">Delivery area *</label>
                      <select id="zone" className={input} value={zoneId} onChange={(e) => setZoneId(e.target.value ? Number(e.target.value) : '')} required>
                        <option value="">Select your area</option>
                        {zones.map((z) => (
                          <option key={z.id} value={z.id}>{z.name} — {formatPesewas(z.feePesewas)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={label} htmlFor="address">Delivery address *</label>
                      <textarea id="address" className={input} rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, landmark" required minLength={5} maxLength={500} />
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-bold text-neutral-900">2. Your details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="name">Full name *</label>
                <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
              </div>
              <div>
                <label className={label} htmlFor="phone">Phone *</label>
                <input id="phone" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" placeholder="055 123 4567" autoComplete="tel" />
              </div>
              <div>
                <label className={label} htmlFor="date">{fulfilment === 'delivery' ? 'Delivery date *' : 'Pickup date *'}</label>
                <input id="date" className={input} type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" className={input} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} placeholder="Allergies, message on cake, preferred time…" />
            </div>
          </section>
        </div>

        <aside className="bg-white rounded-2xl border border-neutral-200/80 p-6 h-fit space-y-4 lg:mt-12">
          <h2 className="font-bold text-neutral-900">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="text-neutral-700">{i.quantity} × {i.name}{i.variantTitle ? ` (${i.variantTitle})` : ''}</span>
                <span className="font-medium whitespace-nowrap">{formatPesewas(i.unitPricePesewas * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatPesewas(subtotalPesewas)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">{fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}</span><span>{fulfilment === 'delivery' ? (zone ? formatPesewas(fee) : 'Select area') : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{formatPesewas(total)}</span></div>
          </div>
          {paused && <p role="status" className="rounded-xl bg-amber-50 text-amber-800 text-xs p-3">{settings!.pauseMessage}</p>}
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <button disabled={busy || paused || (fulfilment === 'delivery' && zonesLoaded && zones.length === 0)} className="w-full py-3 rounded-full bg-[#DE1B76] hover:bg-[#B8125C] disabled:opacity-60 text-white text-sm font-semibold">
            {busy ? 'Placing your order…' : 'Place order'}
          </button>
          <p className="text-[11px] text-neutral-500">Final prices and delivery fees are confirmed by our system when you place the order.</p>
        </aside>
      </form>
    </div>
  );
}
