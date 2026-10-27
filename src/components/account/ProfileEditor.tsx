import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function ProfileEditor() {
  const { userProfile, updateProfileDetails } = useAuth();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFirst(userProfile?.firstName ?? '');
    setLast(userProfile?.lastName ?? '');
    setPhone(userProfile?.phone ?? '');
  }, [userProfile?.firstName, userProfile?.lastName, userProfile?.phone]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      await updateProfileDetails(first.trim(), last.trim(), phone.trim());
      setMsg({ ok: true, text: 'Details saved.' });
    } catch (err: any) {
      setMsg({ ok: false, text: err?.message || 'Could not save your details.' });
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DE1B76]';
  return (
    <form onSubmit={save} className="pt-6 border-t border-neutral-100 space-y-4">
      <h4 className="text-sm font-bold text-neutral-900">Edit your details</h4>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className={input} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" required aria-label="First name" />
        <input className={input} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" required aria-label="Last name" />
        <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="055 123 4567" required type="tel" aria-label="Phone number" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={busy} className="px-5 py-2.5 rounded-full bg-[#DE1B76] text-white text-sm font-semibold disabled:opacity-60">{busy ? 'Saving…' : 'Save details'}</button>
        {msg && <span className={`text-xs ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</span>}
      </div>
    </form>
  );
}
