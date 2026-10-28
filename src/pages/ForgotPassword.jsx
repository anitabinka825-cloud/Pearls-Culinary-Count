import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Alert, AuthCard, Field, Spinner } from '../components/ui.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await api.forgotPassword(email); setSent(true); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <Alert kind="success">If an account exists for {email}, a reset link is on its way. It expires in 1 hour.</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Alert>{error}</Alert>
          <Field id="email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />} Send reset link</button>
        </form>
      )}
      <Link to="/login" className="text-sm text-brand-600 hover:underline">Back to sign in</Link>
    </AuthCard>
  );
}
