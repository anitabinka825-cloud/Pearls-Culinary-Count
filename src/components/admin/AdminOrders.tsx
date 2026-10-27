import React, { useCallback, useEffect, useState } from 'react';
import { AdminOrder, Order, adminGetOrder, adminListOrders, adminUpdateOrder } from '../../services/api';
import { formatPesewas } from '../../lib/purchasable';
import { ORDER_STATUS_LABEL } from '../cart/OrderView';
import { card, input, btnPrimary, btnGhost, fmtDate, waLink, Chip, Notice } from './adminUi';

const FILTERS: { id: string; label: string }[] = [
  { id: 'active', label: 'To work on' },
  { id: 'pending_payment', label: 'Awaiting payment' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: '', label: 'All' },
];

const ACTION_LABEL: Partial<Record<Order['status'], string>> = {
  preparing: 'Start preparing',
  ready: 'Mark ready',
  out_for_delivery: 'Out for delivery',
  completed: 'Mark completed',
  cancelled: 'Cancel order',
};

export function AdminOrders({ onChanged }: { onChanged: () => void }) {
  const [filter, setFilter] = useState('active');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [openRef, setOpenRef] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(() => {
    adminListOrders(filter, debouncedQ).then((o) => { setOrders(o); setError(''); }).catch((e) => setError(e.message));
  }, [filter, debouncedQ]);
  useEffect(() => { setOrders(null); load(); }, [load]);

  useEffect(() => {
    setDetail(null);
    if (openRef) adminGetOrder(openRef).then(setDetail).catch((e) => setError(e.message));
  }, [openRef]);

  const act = async (body: { status?: Order['status']; paymentStatus?: 'refunded' }, confirmText?: string) => {
    if (!detail || (confirmText && !window.confirm(confirmText))) return;
    setBusy(true);
    setError('');
    try {
      setDetail(await adminUpdateOrder(detail.reference, body));
      load();
      onChanged();
    } catch (e: any) {
      setError(e.message);
      adminGetOrder(detail.reference).then(setDetail).catch(() => undefined); // show the true state
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.id || 'all'} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Chip>
        ))}
        <input
          className={`${input} sm:ml-auto sm:max-w-xs`}
          placeholder="Search reference, name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search orders"
        />
      </div>
      {error && <Notice kind="error">{error}</Notice>}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 items-start">
        <div className="space-y-2">
          {!orders && <Notice kind="info">Loading orders…</Notice>}
          {orders?.length === 0 && <Notice kind="info">No orders here.</Notice>}
          {orders?.map((o) => (
            <button key={o.id} type="button" onClick={() => setOpenRef(o.reference)}
              className={`${card} w-full text-left p-4 hover:border-[#DE1B76]/40 ${openRef === o.reference ? 'border-[#DE1B76]' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-neutral-900">{o.reference}</span>
                <span className="px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-[11px] font-semibold">
                  {ORDER_STATUS_LABEL[o.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-600">
                {o.customerName} · {o.fulfilment === 'delivery' ? `Delivery – ${o.zoneName}` : 'Pickup'} · due {o.preferredDate}
              </p>
              <p className="text-xs text-neutral-500">
                {formatPesewas(o.totalPesewas)}{o.needsRefund && <span className="ml-2 font-semibold text-red-600">Refund needed</span>}
              </p>
            </button>
          ))}
        </div>

        {openRef && (
          <div className={`${card} p-5 space-y-4 text-sm lg:sticky lg:top-24`}>
            {!detail ? (
              <p className="text-neutral-500">Loading…</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-neutral-900">{detail.reference}</h3>
                    <p className="text-xs text-neutral-500">Placed {fmtDate(detail.createdAt)}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-[11px] font-semibold">
                    {ORDER_STATUS_LABEL[detail.status]}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">{detail.customerName}</p>
                  <p className="text-neutral-600">
                    <a className="underline" href={`tel:${detail.customerPhone}`}>{detail.customerPhone}</a>
                    {' · '}
                    <a className="underline" href={waLink(detail.customerPhone)} target="_blank" rel="noreferrer">WhatsApp</a>
                  </p>
                  {detail.customerEmail && <p className="text-neutral-500">{detail.customerEmail}</p>}
                </div>

                <div className="bg-neutral-50 rounded-xl p-3 space-y-0.5">
                  <p><span className="text-neutral-500">Needed on</span> <strong>{detail.preferredDate}</strong></p>
                  {detail.fulfilment === 'delivery'
                    ? <p><span className="text-neutral-500">Deliver to</span> <strong>{detail.zoneName}</strong> — {detail.deliveryAddress}</p>
                    : <p><strong>Customer pickup</strong></p>}
                  {detail.notes && <p><span className="text-neutral-500">Customer note</span> {detail.notes}</p>}
                </div>

                <ul className="space-y-1.5">
                  {detail.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-3">
                      <span>{i.quantity} × {i.name}{i.variantTitle ? ` (${i.variantTitle})` : ''}</span>
                      <span>{formatPesewas(i.lineTotalPesewas)}</span>
                    </li>
                  ))}
                  {detail.fulfilment === 'delivery' && (
                    <li className="flex justify-between text-neutral-500"><span>Delivery</span><span>{formatPesewas(detail.deliveryFeePesewas)}</span></li>
                  )}
                  <li className="flex justify-between font-bold border-t border-neutral-100 pt-2">
                    <span>Total · {detail.paymentStatus}</span><span>{formatPesewas(detail.totalPesewas)}</span>
                  </li>
                </ul>

                {detail.payments.length > 0 && (
                  <div className="text-xs text-neutral-500 space-y-0.5">
                    <p className="font-semibold text-neutral-700">Payment attempts</p>
                    {detail.payments.map((p) => (
                      <p key={p.id}>
                        {p.reference} · {p.status}{p.channel ? ` · ${p.channel}` : ''}{p.note ? ` · ${p.note.replace(/_/g, ' ')}` : ''}
                      </p>
                    ))}
                  </div>
                )}

                {detail.needsRefund && (
                  <div className="rounded-xl bg-red-50 p-3 space-y-2">
                    <p className="text-red-700">
                      This order was cancelled after payment. Refund {formatPesewas(detail.totalPesewas)} in your Paystack dashboard, then record it here.
                    </p>
                    <button type="button" className={btnGhost} disabled={busy}
                      onClick={() => act({ paymentStatus: 'refunded' }, 'Only continue once the refund has been made in Paystack.')}>
                      I've refunded this order
                    </button>
                  </div>
                )}

                {detail.nextStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detail.nextStatuses.map((s) =>
                      s === 'cancelled' ? (
                        <button key={s} type="button" className={`${btnGhost} !border-red-300 !text-red-600`} disabled={busy}
                          onClick={() => act({ status: s }, detail.paymentStatus === 'paid'
                            ? 'Cancel this paid order? You will need to refund the customer.'
                            : 'Cancel this order? The customer will no longer be able to pay for it.')}>
                          {ACTION_LABEL[s]}
                        </button>
                      ) : (
                        <button key={s} type="button" className={btnPrimary} disabled={busy} onClick={() => act({ status: s })}>
                          {ACTION_LABEL[s] ?? ORDER_STATUS_LABEL[s]}
                        </button>
                      ),
                    )}
                  </div>
                )}
                {detail.status === 'pending_payment' && (
                  <p className="text-xs text-neutral-500">Orders become “Paid” automatically once Paystack confirms the payment.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
