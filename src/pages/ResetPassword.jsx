import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { Alert, AuthCard, Field, Spinner } from '../components/ui.jsx';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await api.resetPassword(token, password); setDone(true); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <AuthCard title="Choose a new password">
      {!token ? <Alert>This reset link is missing its token. Request a new one.</Alert>
        : done ? <Alert kind="success">Password updated. You can now sign in.</Alert>
        : (
          <form onSubmit={submit} className="space-y-4">
            <Alert>{error}</Alert>
            <Field id="password" label="New password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />} Update password</button>
          </form>
        )}
      <Link to="/login" className="text-sm text-brand-600 hover:underline">Go to sign in</Link>
    </AuthCard>
  );
}
