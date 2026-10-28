import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, AuthCard, Spinner } from '../components/ui.jsx';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { user, refreshUser } = useAuth();
  const [state, setState] = useState(token ? 'working' : 'missing');
  const [error, setError] = useState('');
  const ran = useRef(false); // StrictMode runs effects twice in dev; the token is single-use

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    api.verifyEmail(token)
      .then(() => { setState('ok'); if (user) refreshUser().catch(() => {}); })
      .catch((e) => { setError(e.message); setState('error'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthCard title="Email verification">
      {state === 'working' && <div className="flex items-center gap-2 text-sm text-slate-600"><Spinner /> Verifying...</div>}
      {state === 'missing' && <Alert>This link is missing its token.</Alert>}
      {state === 'ok' && <Alert kind="success">Your email is verified. Thanks!</Alert>}
      {state === 'error' && <Alert>{error}</Alert>}
      <Link to={user ? '/dashboard' : '/login'} className="text-sm text-brand-600 hover:underline">Continue</Link>
    </AuthCard>
  );
}
