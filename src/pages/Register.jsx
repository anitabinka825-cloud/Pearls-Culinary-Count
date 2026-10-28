import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, AuthCard, Field, Spinner } from '../components/ui.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await register(form.name, form.email, form.password); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <AuthCard title="Create your account" subtitle="We'll email you a link to verify your address.">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field id="name" label="Name" autoComplete="name" required value={form.name} onChange={set('name')} />
        <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} />
        <Field id="password" label="Password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={set('password')} />
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />} Create account</button>
      </form>
      <p className="text-sm text-slate-600">Already registered? <Link to="/login" className="text-brand-600 hover:underline">Sign in</Link></p>
    </AuthCard>
  );
}
