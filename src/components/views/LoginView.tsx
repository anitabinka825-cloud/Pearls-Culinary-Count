import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../services/firebase';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function LoginView() {
  const { currentUser, signIn, signInWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (currentUser) {
      // Return to where the visitor was heading (e.g. checkout), not always the account page.
      navigate((location.state as any)?.from?.pathname || '/account', { replace: true });
    }
  }, [currentUser, navigate, location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Determine where to redirect after login
  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) {
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      // handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      clearError();
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      // handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-[#FDF2F7] text-[#DE1B76] text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
            Welcome Back
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-neutral-600 text-sm mt-2">
            Access your Pearls Culinary Counts profile and order information in Accra.
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
            <div className="flex items-center space-x-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Firebase Configuration Required</span>
            </div>
            <p>
              Authentication is currently unconfigured. Please add your <code className="bg-amber-100 px-1 rounded">VITE_FIREBASE_*</code> environment variables in <code className="bg-amber-100 px-1 rounded">.env</code> to activate sign-in. Public product browsing remains fully operational.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pearl@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DE1B76] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[#DE1B76] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#DE1B76] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 bg-[#DE1B76] hover:bg-[#c41465] text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer text-sm"
          >
            {submitting ? (
              <span className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="mt-4 w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-700 font-medium rounded-xl border border-neutral-300 shadow-xs transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.22 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.1 0 9.99 0 12s.43 3.9 1.19 5.42l4.09-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google Account</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#DE1B76] hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center space-x-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Secure Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
