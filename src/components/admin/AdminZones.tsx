import React, { useEffect, useState } from 'react';
import { DeliveryZone, adminCreateZone, adminDeleteZone, adminListZones, adminUpdateZone } from '../../services/api';
import { card, input, btnPrimary, btnGhost, Notice } from './adminUi';

/** "35" or "35.50" → pesewas; null when it isn't a valid amount. */
const toPesewas = (v: string) => {
  const n = Number(v.trim());
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n * 100) : null;
};

export function AdminZones() {
  const [zones, setZones] = useState<DeliveryZone[] | null>(null);
  const [error, setError] = useState('');
  const load = () => adminListZones().then((z) => { setZones(z); setError(''); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const [name, setName] = useState('');
  const [fee, setFee] = useState('');
  const add = async () => {
    const p = toPesewas(fee);
    if (name.trim().length < 2 || p === null) return setError('Enter an area name and a delivery fee in GH₵.');
    try { await adminCreateZone({ name: name.trim(), feePesewas: p, active: true }); setName(''); setFee(''); load(); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <Notice kind="info">
        Customers can only choose areas that are switched on. New areas start switched off at GH₵ 0 — set the fee, then switch them on.
      </Notice>
      {error && <Notice kind="error">{error}</Notice>}
      {!zones && !error && <Notice kind="info">Loading delivery areas…</Notice>}
      <ul className="space-y-2">
        {zones?.map((z) => <ZoneRow key={z.id} z={z} onChanged={load} onError={setError} />)}
      </ul>
      <div className={`${card} p-4 flex flex-wrap gap-2 items-end`}>
        <label className="text-xs font-semibold text-neutral-600 flex-1 min-w-[160px]">New area
          <input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tema Community 25" />
        </label>
        <label className="text-xs font-semibold text-neutral-600 w-28">Fee (GH₵)
          <input className={`${input} mt-1`} inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="35" />
        </label>
        <button type="button" className={btnPrimary} onClick={add}>Add area</button>
      </div>
    </div>
  );
}

function ZoneRow({ z, onChanged, onError }: { z: DeliveryZone; onChanged: () => void; onError: (m: string) => void }) {
  const [fee, setFee] = useState((z.feePesewas / 100).toString());
  useEffect(() => setFee((z.feePesewas / 100).toString()), [z.feePesewas]);
  const p = toPesewas(fee);
  const run = async (fn: () => Promise<unknown>) => { try { await fn(); onChanged(); } catch (e: any) { onError(e.message); } };
  const switchOn = () => {
    if (!z.active && z.feePesewas === 0 && !window.confirm('This area has a GH₵ 0 fee, so delivery there would be free. Switch it on anyway?')) return;
    run(() => adminUpdateZone(z.id, { active: !z.active }));
  };
  return (
    <li className={`${card} p-4 flex flex-wrap items-center gap-3 text-sm`}>
      <span className="font-semibold text-neutral-900 flex-1 min-w-[140px]">{z.name}</span>
      <label className="flex items-center gap-1.5 text-xs text-neutral-500">GH₵
        <input className={`${input} !w-24`} inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} aria-label={`Fee for ${z.name}`} />
      </label>
      <button type="button" className={btnGhost} disabled={p === null || p === z.feePesewas}
        onClick={() => run(() => adminUpdateZone(z.id, { feePesewas: p! }))}>Save fee</button>
      <button type="button" onClick={switchOn} aria-pressed={z.active}
        className={`px-4 py-2 rounded-full text-xs font-semibold ${z.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
        {z.active ? 'On' : 'Off'}
      </button>
      <button type="button" className="text-xs text-neutral-400 hover:text-red-600"
        onClick={() => window.confirm(`Delete ${z.name}? Past orders keep their saved area name.`) && run(() => adminDeleteZone(z.id))}>
        Delete
      </button>
    </li>
  );
}
