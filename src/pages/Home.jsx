import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { APP_NAME } from '../components/Layout.jsx';

export default function Home() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    api.health(true).then(() => setStatus('up')).catch(() => setStatus('down'));
  }, []);

  const badge = { checking: 'bg-slate-100 text-slate-600', up: 'bg-green-100 text-green-700', down: 'bg-red-100 text-red-700' }[status];
  const label = { checking: 'Checking API...', up: 'API connected', down: 'API unreachable - is the server running?' }[status];

  return (
    <section className="py-12 text-center">
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge}`}>{label}</span>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Welcome to {APP_NAME}</h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">
        Your scaffold is running. Replace this page with your real home page once we define the app.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/register" className="btn-primary">Create account</Link>
        <Link to="/login" className="btn-secondary">Sign in</Link>
      </div>
    </section>
  );
}
