import React from 'react';

export const card = 'bg-white rounded-2xl border border-neutral-200/80';
export const input =
  'w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE1B76]/30 focus:border-[#DE1B76]';
export const btnPrimary =
  'px-4 py-2 rounded-full bg-[#DE1B76] text-white text-xs font-semibold hover:bg-[#c4176a] disabled:opacity-50 disabled:cursor-not-allowed';
export const btnGhost =
  'px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-xs font-semibold hover:border-[#DE1B76] hover:text-[#DE1B76] disabled:opacity-50';

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Ghana number (+233…) → wa.me link digits. */
export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active ? 'bg-[#DE1B76] border-[#DE1B76] text-white' : 'bg-white border-neutral-300 text-neutral-700 hover:border-[#DE1B76]'
      }`}
    >
      {children}
    </button>
  );
}

export function Notice({ kind, children }: { kind: 'error' | 'info'; children: React.ReactNode }) {
  return (
    <p className={`rounded-xl px-4 py-3 text-sm ${kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-neutral-100 text-neutral-600'}`} role={kind === 'error' ? 'alert' : undefined}>
      {children}
    </p>
  );
}
