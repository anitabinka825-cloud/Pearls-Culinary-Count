import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Shield, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'My App';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const link = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-brand-600" /> {APP_NAME}
          </Link>
          <nav className="flex items-center gap-5">
            {user ? (
              <>
                <NavLink to="/dashboard" className={link}><span className="inline-flex items-center gap-1"><LayoutDashboard className="h-4 w-4" />Dashboard</span></NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={link}><span className="inline-flex items-center gap-1"><Shield className="h-4 w-4" />Admin</span></NavLink>
                )}
                <button className="btn-secondary !py-1.5" onClick={() => { logout(); navigate('/'); }}>
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={link}>Sign in</NavLink>
                <Link to="/register" className="btn-primary !py-1.5">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10"><Outlet /></main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {APP_NAME}
      </footer>
    </div>
  );
}
