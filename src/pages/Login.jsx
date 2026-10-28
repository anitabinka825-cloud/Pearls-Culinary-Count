import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, AuthCard, Field, Spinner } from '../components/ui.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dest = location.state?.from || '/dashboard';

  if (user) return <Navigate to={dest} replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(form.email, form.password); navigate(dest, { replace: true }); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account.">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} />
        <Field id="password" label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={set('password')} />
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />} Sign in</button>
      </form>
      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="text-brand-600 hover:underline">Forgot password?</Link>
        <Link to="/register" className="text-brand-600 hover:underline">Create account</Link>
      </div>
    </AuthCard>
  );
}
