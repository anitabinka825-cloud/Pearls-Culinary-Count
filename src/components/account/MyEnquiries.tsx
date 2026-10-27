import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { getMyEnquiries, SavedEnquiry } from '../../services/api';

const STATUS_LABEL: Record<SavedEnquiry['status'], string> = {
  new: 'Received',
  contacted: 'We have contacted you',
  quoted: 'Quote sent',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function MyEnquiries({ onNew }: { onNew: () => void }) {
  const [items, setItems] = useState<SavedEnquiry[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyEnquiries().then(setItems).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-sm text-red-600">{error}</p>;
  if (!items) return <p className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-sm text-neutral-500">Loading your enquiries…</p>;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No enquiries yet</h3>
        <p className="text-sm text-neutral-600">Custom cake, catering and training requests you send while signed in appear here.</p>
        <button onClick={onNew} className="px-5 py-2.5 rounded-full bg-[#DE1B76] text-white text-sm font-semibold">Start a custom order</button>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((e) => (
        <li key={e.id} className="bg-white rounded-2xl border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-neutral-900 text-sm">{e.productType}</p>
            <span className="px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-[11px] font-semibold">{STATUS_LABEL[e.status]}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {e.reference} · {new Date(e.createdAt).toLocaleDateString()}
            {e.preferredDate ? ` · Needed ${e.preferredDate}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}
