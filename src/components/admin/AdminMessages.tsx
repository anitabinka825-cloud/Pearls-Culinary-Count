import React, { useCallback, useEffect, useState } from 'react';
import { AdminSms, SmsCreditsInfo, adminListSms, adminResendSms, adminSmsCredits } from '../../services/api';
import { card, btnGhost, fmtDate, Notice } from './adminUi';

const KIND_LABEL: Record<string, string> = {
  order_paid: 'Payment received',
  order_ready: 'Order ready',
  order_out: 'Out for delivery',
  order_cancelled: 'Order cancelled',
  order_refunded: 'Refund issued',
  enquiry_received: 'Enquiry received',
  owner_new_order: 'Alert to you: new order',
  owner_new_enquiry: 'Alert to you: new enquiry',
};

/** One plain-language status per message: what happened to it, not how it was plumbed. */
function statusOf(m: AdminSms): { text: string; tone: 'good' | 'bad' | 'neutral' } {
  if (m.state === 'skipped') return { text: 'Not sent — SMS not set up yet', tone: 'bad' };
  if (m.state === 'failed') return { text: 'Could not send', tone: 'bad' };
  if (m.state === 'pending') return { text: 'Sending…', tone: 'neutral' };
  switch (m.deliveryStatus) {
    case 'delivered': return { text: 'Delivered', tone: 'good' };
    case 'failed': case 'rejected': case 'expired': return { text: 'Not delivered', tone: 'bad' };
    default: return { text: 'Sent', tone: 'neutral' };
  }
}
const tone = { good: 'bg-green-100 text-green-700', bad: 'bg-red-100 text-red-700', neutral: 'bg-neutral-100 text-neutral-600' };

export function AdminMessages() {
  const [rows, setRows] = useState<AdminSms[] | null>(null);
  const [credits, setCredits] = useState<SmsCreditsInfo | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    adminListSms().then((r) => { setRows(r); setError(''); }).catch((e) => setError(e.message));
    adminSmsCredits().then(setCredits).catch(() => setCredits(null));
  }, []);
  useEffect(load, [load]);

  const resend = async (m: AdminSms) => {
    setBusyId(m.id);
    setError('');
    try {
      const r = await adminResendSms(m.id);
      if (r.state !== 'sent') setError(r.error || 'The message could not be sent.');
      load();
    } catch (e: any) { setError(e.message); } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-4">
      <CreditsCard credits={credits} />
      {error && <Notice kind="error">{error}</Notice>}
      {!rows && !error && <Notice kind="info">Loading messages…</Notice>}
      {rows?.length === 0 && <Notice kind="info">No text messages yet. They appear here as customers order and enquire.</Notice>}
      <ul className="space-y-2">
        {rows?.map((m) => {
          const s = statusOf(m);
          return (
            <li key={m.id} className={`${card} p-4 text-sm space-y-1.5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-neutral-900">{KIND_LABEL[m.kind] ?? m.kind}</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${tone[s.tone]}`}>{s.text}</span>
              </div>
              <p className="text-xs text-neutral-500">
                To {m.recipient} · {m.orderReference || m.enquiryReference} · {fmtDate(m.createdAt)}
              </p>
              <p className="text-neutral-700">{m.body}</p>
              {m.error && m.state !== 'sent' && <p className="text-xs text-red-600">{m.error}</p>}
              {(m.state === 'failed' || m.state === 'skipped') && (
                <button type="button" className={btnGhost} disabled={busyId === m.id} onClick={() => resend(m)}>
                  {busyId === m.id ? 'Sending…' : 'Send again'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CreditsCard({ credits }: { credits: SmsCreditsInfo | null }) {
  if (!credits) return null;
  if (!credits.configured) {
    return (
      <Notice kind="info">
        Text messages are switched off until Sailup is connected (add <code>SAILUP_API_KEY</code> and your approved sender name on the server).
        Until then, messages are saved below as “Not sent” and you can send them later.
      </Notice>
    );
  }
  if ('error' in credits) return <Notice kind="error">Couldn't check your Sailup credits: {credits.error}</Notice>;
  const low = credits.balance < 50 && !credits.autoTopup.enabled;
  return (
    <div className={`${card} p-5 flex flex-wrap items-center justify-between gap-3 ${low ? 'ring-1 ring-red-300' : ''}`}>
      <div>
        <p className="text-xs text-neutral-500">Sailup credits left</p>
        <p className={`text-2xl font-bold ${low ? 'text-red-600' : 'text-neutral-900'}`}>{credits.balance.toLocaleString()}</p>
      </div>
      <p className="text-xs text-neutral-500 max-w-sm">
        One credit sends one text of up to 160 characters.{' '}
        {credits.autoTopup.enabled
          ? 'Auto top-up is on.'
          : low
            ? 'Auto top-up is off — top up in your Sailup dashboard or customer texts will stop.'
            : 'Auto top-up is off.'}
      </p>
    </div>
  );
}
