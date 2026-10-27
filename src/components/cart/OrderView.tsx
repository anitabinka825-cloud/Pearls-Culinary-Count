import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getOrder, Order, startPayment, verifyPayment } from '../../services/api';
import { formatPesewas } from '../../lib/purchasable';
import { createWhatsAppUrl } from '../../config/business';

export const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
  pending_payment: 'Awaiting payment',
  paid: 'Paid',
  preparing: 'Being prepared',
  ready: 'Ready',
  out_for_delivery: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function OrderView() {
  const { reference = '' } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useSearchParams();
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState('');
  const [checking, setChecking] = useState(false);

  const reload = () => getOrder(reference).then(setOrder).catch((e) => setError(e.message));

  /** Asks the server to confirm with Paystack (the page URL alone proves nothing). */
  const confirmPayment = async (): Promise<'paid' | 'pending' | 'failed' | 'error'> => {
    try {
      const { paymentStatus } = await verifyPayment(reference);
      await reload();
      return paymentStatus;
    } catch (e: any) {
      setPayMessage(e?.message || 'We could not confirm your payment yet.');
      return 'error';
    }
  };

  useEffect(() => {
    reload();
  }, [reference]);

  // Returning from Paystack: confirm, and keep checking for a while (mobile money can take a minute).
  const returnedFromPaystack = search.has('reference') || search.has('trxref');
  useEffect(() => {
    if (!returnedFromPaystack) return;
    let cancelled = false;
    let tries = 0;
    setChecking(true);
    const run = async () => {
      const r = await confirmPayment();
      if (cancelled) return;
      if (r === 'pending' && ++tries < 24) {
        setPayMessage('Waiting for your payment to be approved… check your phone for a prompt.');
        setTimeout(run, 5000);
        return;
      }
      setChecking(false);
      setPayMessage(r === 'paid' ? '' : r === 'failed' ? 'The payment was not completed. You can try again.' : r === 'pending' ? 'We have not received confirmation yet. Use “Check payment status” in a moment.' : payMessage);
      setSearch({}, { replace: true });
    };
    run();
    return () => { cancelled = true; };
  }, [returnedFromPaystack]);

  const pay = async () => {
    setPaying(true);
    setPayMessage('');
    try {
      const { authorizationUrl } = await startPayment(reference);
      window.location.assign(authorizationUrl);
    } catch (e: any) {
      setPayMessage(e?.message || 'Could not start the payment.');
      setPaying(false);
    }
  };

  if (error) return <div className="min-h-[50vh] flex items-center justify-center text-sm text-neutral-600">{error}</div>;
  if (!order) return <div className="min-h-[50vh] flex items-center justify-center text-sm text-neutral-500">Loading your order…</div>;

  return (
    <div className="bg-[#FAFAFA] py-10 lg:py-16 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-[#DE1B76] mx-auto" />
          <h1 className="font-serif text-3xl font-bold text-[#121214]">Order {order.reference}</h1>
          <span className="inline-block px-3 py-1 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-xs font-semibold">{ORDER_STATUS_LABEL[order.status]}</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-4 text-sm">
          <ul className="space-y-2">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <span>{i.quantity} × {i.name}{i.variantTitle ? ` (${i.variantTitle})` : ''}</span>
                <span className="font-medium whitespace-nowrap">{formatPesewas(i.lineTotalPesewas)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-100 pt-3 space-y-1">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatPesewas(order.subtotalPesewas)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">{order.fulfilment === 'delivery' ? `Delivery (${order.zoneName})` : 'Pickup'}</span><span>{order.fulfilment === 'delivery' ? formatPesewas(order.deliveryFeePesewas) : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPesewas(order.totalPesewas)}</span></div>
          </div>
          <div className="border-t border-neutral-100 pt-3 text-neutral-600 space-y-1">
            <p><strong>{order.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'} date:</strong> {order.preferredDate}</p>
            {order.fulfilment === 'delivery' && <p><strong>Address:</strong> {order.deliveryAddress}</p>}
            <p><strong>Contact:</strong> {order.customerName} · {order.customerPhone}</p>
          </div>
        </div>

        {order.paymentStatus === 'paid' && (
          <div role="status" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-semibold">Payment received. Thank you!</p>
            <p>We will confirm the details of your {order.fulfilment === 'delivery' ? 'delivery' : 'pickup'} with you shortly.</p>
          </div>
        )}

        {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 space-y-3 text-center">
            <p className="text-sm text-neutral-700">Pay securely with mobile money or card to confirm your order.</p>
            <button onClick={pay} disabled={paying || checking} className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#DE1B76] hover:bg-[#B8125C] disabled:opacity-60 text-white text-sm font-semibold">
              {paying ? 'Opening secure payment…' : `Pay ${formatPesewas(order.totalPesewas)}`}
            </button>
            <div>
              <button onClick={async () => { setChecking(true); const r = await confirmPayment(); setPayMessage(r === 'pending' ? 'Still waiting for confirmation.' : r === 'failed' ? 'No completed payment found yet.' : ''); setChecking(false); }} disabled={checking} className="text-xs font-semibold text-neutral-600 hover:text-[#DE1B76] disabled:opacity-60">
                {checking ? 'Checking…' : 'Check payment status'}
              </button>
            </div>
            {payMessage && <p role="alert" className="text-xs text-amber-800">{payMessage}</p>}
            <p className="text-[11px] text-neutral-500">Having trouble?{' '}
              <a href={createWhatsAppUrl(`Hello, I need help paying for order ${order.reference}.`)} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#DE1B76] hover:underline">Message us on WhatsApp</a>
            </p>
          </div>
        )}
        <div className="text-center"><Link to="/account" className="text-xs font-semibold text-neutral-600 hover:text-[#DE1B76]">View all my orders</Link></div>
      </div>
    </div>
  );
}
