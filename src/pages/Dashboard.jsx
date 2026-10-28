import { useEffect, useState } from 'react';
import { MailWarning, Save } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import AvatarUpload from '../components/AvatarUpload.jsx';
import PayButton from '../components/PayButton.jsx';
import { Alert, Field, Spinner } from '../components/ui.jsx';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [msg, setMsg] = useState({ kind: 'success', text: '' });
  const [busy, setBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');
  const [payments, setPayments] = useState([]);

  const loadPayments = () => api.myPayments().then((r) => setPayments(r.payments)).catch(() => {});
  useEffect(() => { loadPayments(); }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setBusy(true); setMsg({ kind: 'success', text: '' });
    try { setUser((await api.updateProfile(name)).user); setMsg({ kind: 'success', text: 'Profile saved.' }); }
    catch (err) { setMsg({ kind: 'error', text: err.message }); }
    finally { setBusy(false); }
  }

  async function resend() {
    setVerifyMsg('');
    try { await api.resendVerification(); setVerifyMsg('Verification email sent. Check your inbox.'); }
    catch (err) { setVerifyMsg(err.message); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hi{user.name ? `, ${user.name}` : ''} 👋</h1>

      {!user.emailVerified && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <MailWarning className="h-5 w-5 shrink-0" />
          <span className="flex-1">Please verify your email address ({user.email}).</span>
          <button className="btn-secondary !py-1.5" onClick={resend}>Resend email</button>
          {verifyMsg && <span className="w-full text-xs">{verifyMsg}</span>}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card space-y-5">
          <h2 className="font-semibold">Profile</h2>
          <AvatarUpload />
          <form onSubmit={saveProfile} className="space-y-3">
            <Field id="name" label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <p className="text-xs text-slate-500">Signed in as {user.email} &middot; role: {user.role}</p>
            <Alert kind={msg.kind}>{msg.text}</Alert>
            <button className="btn-primary" disabled={busy}>{busy ? <Spinner /> : <Save className="h-4 w-4" />} Save</button>
          </form>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold">Payments (Paystack demo)</h2>
          <PayButton amount={10} onPaid={loadPayments} />
          {payments.length > 0 && (
            <ul className="divide-y divide-slate-100 text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex justify-between py-2">
                  <span>{(p.amountMinor / 100).toFixed(2)} {p.currency}</span>
                  <span className={p.status === 'paid' ? 'text-green-600' : 'text-slate-500'}>{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
