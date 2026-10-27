import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSummary, ApiError, adminGetSummary } from '../../services/api';
import { AdminOverview, AdminTab } from '../admin/AdminOverview';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminEnquiries } from '../admin/AdminEnquiries';
import { AdminZones } from '../admin/AdminZones';
import { AdminMessages } from '../admin/AdminMessages';
import { AdminSettings } from '../admin/AdminSettings';
import { Notice } from '../admin/adminUi';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'zones', label: 'Delivery areas' },
  { id: 'messages', label: 'Text messages' },
  { id: 'settings', label: 'Site settings' },
];

/** Access is decided by the server: a non-admin simply gets 403 from the very first call. */
export function AdminView() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    adminGetSummary()
      .then((s) => { setSummary(s); setError(''); })
      .catch((e) => (e instanceof ApiError && e.status === 403 ? setDenied(true) : setError(e.message)));
  }, []);
  useEffect(refresh, [refresh]);

  if (denied) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-3">
        <h1 className="text-xl font-bold text-neutral-900">Staff area</h1>
        <p className="text-sm text-neutral-600">This page is only for the Pearls team. If you should have access, ask the owner to add your email as an admin.</p>
        <Link to="/" className="inline-block text-sm font-semibold text-[#DE1B76] underline">Back to the shop</Link>
      </div>
    );
  }

  const badge = (id: AdminTab) =>
    id === 'orders' ? summary?.activeOrders : id === 'enquiries' ? summary?.newEnquiries : 0;

  return (
    <div className="bg-[#FAFAFA] min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Orders, enquiries, delivery areas, text messages and site settings.</p>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200" aria-label="Dashboard sections">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px ${
                tab === t.id ? 'border-[#DE1B76] text-[#DE1B76]' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}>
              {t.label}
              {!!badge(t.id) && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#DE1B76] text-white text-[10px]">{badge(t.id)}</span>}
            </button>
          ))}
        </nav>

        {error && <Notice kind="error">{error}</Notice>}
        {tab === 'overview' && (summary
          ? <AdminOverview summary={summary} onGo={setTab} onChanged={refresh} />
          : !error && <Notice kind="info">Loading…</Notice>)}
        {tab === 'orders' && <AdminOrders onChanged={refresh} />}
        {tab === 'enquiries' && <AdminEnquiries onChanged={refresh} />}
        {tab === 'zones' && <AdminZones />}
        {tab === 'messages' && <AdminMessages />}
        {tab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
