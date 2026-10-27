import React, { useCallback, useEffect, useState } from 'react';
import {
  AdminSummary, FlaggedPayment, adminFlaggedPayments, adminMarkPaymentRefunded,
} from '../../services/api';
import { formatPesewas } from '../../lib/purchasable';
import { card, btnGhost, fmtDate, Notice } from './adminUi';

export type AdminTab = 'overview' | 'orders' | 'enquiries' | 'zones' | 'messages' | 'settings';

export function AdminOverview({ summary, onGo, onChanged }: {
  summary: AdminSummary; onGo: (t: AdminTab) => void; onChanged: () => void;
}) {
  const [flagged, setFlagged] = useState<FlaggedPayment[]>([]);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    adminFlaggedPayments().then(setFlagged).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const tiles: { label: string; value: string; tab: AdminTab; hot?: boolean }[] = [
    { label: 'Orders to work on', value: String(summary.activeOrders), tab: 'orders', hot: summary.activeOrders > 0 },
    { label: 'New enquiries', value: String(summary.newEnquiries), tab: 'enquiries', hot: summary.newEnquiries > 0 },
    { label: 'Paid, last 30 days', value: formatPesewas(summary.last30Days.revenuePesewas), tab: 'orders' },
    { label: 'Refunds to process', value: String(summary.refundsToProcess), tab: 'orders', hot: summary.refundsToProcess > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <button key={t.label} type="button" onClick={() => onGo(t.tab)}
            className={`${card} p-5 text-left hover:border-[#DE1B76]/40 ${t.hot ? 'ring-1 ring-[#DE1B76]/30' : ''}`}>
            <p className="text-xs text-neutral-500">{t.label}</p>
            <p className={`mt-1 text-2xl font-bold ${t.hot ? 'text-[#DE1B76]' : 'text-neutral-900'}`}>{t.value}</p>
          </button>
        ))}
      </div>

      {error && <Notice kind="error">{error}</Notice>}

      {flagged.length > 0 && (
        <section className={`${card} p-5 space-y-3`}>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Customers who paid twice</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              The order is only credited once. Refund the extra payment in your Paystack dashboard, then tick it off here.
            </p>
          </div>
          <ul className="divide-y divide-neutral-100">
            {flagged.map((p) => (
              <li key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-semibold text-neutral-900">{formatPesewas(p.amountPesewas)} · {p.customerName}</p>
                  <p className="text-xs text-neutral-500">
                    Order {p.orderReference} · Paystack ref {p.reference} · {fmtDate(p.paidAt)}
                  </p>
                </div>
                <button type="button" className={btnGhost}
                  onClick={async () => {
                    if (!window.confirm('Only tick this once you have refunded the extra payment in Paystack. Continue?')) return;
                    try { await adminMarkPaymentRefunded(p.id); load(); onChanged(); }
                    catch (e: any) { setError(e.message); }
                  }}>
                  I've refunded this
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`${card} p-5`}>
        <h3 className="font-bold text-sm text-neutral-900 mb-3">All orders by status</h3>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
          {Object.entries(summary.orders).map(([k, n]) => (
            <div key={k} className="flex justify-between gap-2">
              <dt className="text-neutral-500 capitalize">{k.replace(/_/g, ' ')}</dt>
              <dd className="font-semibold text-neutral-900">{n}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
