import React, { useEffect, useState } from 'react';
import { AdminEnquiry, EnquiryStatus, adminListEnquiries, adminUpdateEnquiry } from '../../services/api';
import { card, input, btnPrimary, fmtDate, waLink, Chip, Notice } from './adminUi';

const STATUSES: EnquiryStatus[] = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];

export function AdminEnquiries({ onChanged }: { onChanged: () => void }) {
  const [filter, setFilter] = useState('new');
  const [rows, setRows] = useState<AdminEnquiry[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setRows(null);
    adminListEnquiries(filter).then((r) => { setRows(r); setError(''); }).catch((e) => setError(e.message));
  }, [filter]);

  const replace = (e: AdminEnquiry) => {
    // Drop it from a status-filtered list if it no longer belongs there.
    setRows((cur) => cur && (filter && e.status !== filter ? cur.filter((x) => x.id !== e.id) : cur.map((x) => (x.id === e.id ? e : x))));
    onChanged();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[...STATUSES, ''].map((s) => (
          <Chip key={s || 'all'} active={filter === s} onClick={() => setFilter(s)}>
            {s ? s[0].toUpperCase() + s.slice(1) : 'All'}
          </Chip>
        ))}
      </div>
      {error && <Notice kind="error">{error}</Notice>}
      {!rows && !error && <Notice kind="info">Loading enquiries…</Notice>}
      {rows?.length === 0 && <Notice kind="info">No enquiries here.</Notice>}
      <div className="space-y-3">
        {rows?.map((e) => <EnquiryCard key={e.id} e={e} onSaved={replace} onError={setError} />)}
      </div>
    </div>
  );
}

function EnquiryCard({ e, onSaved, onError }: { e: AdminEnquiry; onSaved: (e: AdminEnquiry) => void; onError: (m: string) => void }) {
  const [notes, setNotes] = useState(e.adminNotes);
  const [busy, setBusy] = useState(false);
  const save = async (body: { status?: EnquiryStatus; adminNotes?: string }) => {
    setBusy(true);
    onError('');
    try { onSaved(await adminUpdateEnquiry(e.id, body)); } catch (err: any) { onError(err.message); } finally { setBusy(false); }
  };
  const details: [string, string][] = [
    ['Quantity', e.quantity], ['Needed on', e.preferredDate], ['Size', e.size], ['Flavour', e.flavour],
    ['Filling', e.filling], ['Design', e.themeDesign], ['Inscription', e.inscription],
    ['Delivery', e.deliveryLocation], ['Notes', e.specialInstructions],
  ];
  return (
    <article className={`${card} p-5 space-y-3 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-neutral-900">{e.productType}{e.customProductText ? ` — ${e.customProductText}` : ''}</h3>
          <p className="text-xs text-neutral-500">{e.reference} · {fmtDate(e.createdAt)}</p>
        </div>
        <select className={`${input} !w-auto`} value={e.status} disabled={busy} aria-label="Enquiry status"
          onChange={(ev) => save({ status: ev.target.value as EnquiryStatus })}>
          {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <p>
        <strong>{e.customerName}</strong> ·{' '}
        <a className="underline" href={`tel:${e.customerPhone}`}>{e.customerPhone}</a> ·{' '}
        <a className="underline" href={waLink(e.customerPhone)} target="_blank" rel="noreferrer">WhatsApp</a>
        {e.customerEmail && <span className="text-neutral-500"> · {e.customerEmail}</span>}
      </p>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
        {details.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="flex gap-2"><dt className="text-neutral-500 shrink-0">{k}</dt><dd className="text-neutral-900">{v}</dd></div>
        ))}
      </dl>
      <div className="flex gap-2 items-start">
        <textarea className={`${input} min-h-[64px]`} placeholder="Private notes (customers never see these)" maxLength={2000}
          value={notes} onChange={(ev) => setNotes(ev.target.value)} />
        <button type="button" className={btnPrimary} disabled={busy || notes === e.adminNotes} onClick={() => save({ adminNotes: notes })}>
          Save note
        </button>
      </div>
    </article>
  );
}
