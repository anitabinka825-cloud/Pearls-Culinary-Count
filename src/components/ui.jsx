import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input id={id} className="input" {...props} />
    </div>
  );
}

export function Alert({ kind = 'error', children }) {
  if (!children) return null;
  const ok = kind === 'success';
  const Icon = ok ? CheckCircle2 : AlertCircle;
  return (
    <div role={ok ? 'status' : 'alert'} className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" /> <span>{children}</span>
    </div>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}
