import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { api } from '../api.js';
import { openPaystack, PAYSTACK_PUBLIC_KEY } from '../lib/paystack.js';
import { Alert, Spinner } from './ui.jsx';

// Flow: server creates the payment record (and fixes the amount) -> Paystack popup -> server verifies with the secret key.
export default function PayButton({ amount = 10, description = 'Test payment', onPaid }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ kind: 'error', text: '' });

  async function pay() {
    setBusy(true); setMsg({ kind: 'error', text: '' });
    try {
      const { payment, email } = await api.createPayment(amount, description);
      await openPaystack({ email, amountMinor: payment.amountMinor, currency: payment.currency, reference: payment.reference });
      const { payment: result } = await api.verifyPayment(payment.reference);
      if (result.status === 'paid') { setMsg({ kind: 'success', text: 'Payment confirmed. Thank you!' }); onPaid?.(result); }
      else setMsg({ kind: 'error', text: 'We could not confirm the payment yet. Check back shortly.' });
    } catch (e) {
      setMsg({ kind: 'error', text: e.message });
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-3">
      <button className="btn-primary" onClick={pay} disabled={busy || !PAYSTACK_PUBLIC_KEY}>
        {busy ? <Spinner /> : <CreditCard className="h-4 w-4" />} Pay {amount} (test)
      </button>
      {!PAYSTACK_PUBLIC_KEY && <p className="text-xs text-slate-500">Set VITE_PAYSTACK_PUBLIC_KEY in .env and restart to enable.</p>}
      <Alert kind={msg.kind}>{msg.text}</Alert>
    </div>
  );
}
