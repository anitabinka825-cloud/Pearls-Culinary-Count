import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../services/firebase';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export function ForgotPasswordView() {
  const { sendPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successSent, setSuccessSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim()) return;

    try {
      setSubmitting(true);
      await sendPasswordReset(email.trim());
      setSuccessSent(true);
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
            Password Recovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-neutral-600 text-sm mt-2">
            Enter your account email address and we will send you a secure password reset link.
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
            <div className="flex items-center space-x-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Firebase Configuration Required</span>
            </div>
            <p>
              Authentication is currently unconfigured. Please add your <code className="bg-amber-100 px-1 rounded">VITE_FIREBASE_*</code> environment variables in <code className="bg-amber-100 px-1 rounded">.env</code> to activate password recovery. Public product browsing remains fully operational.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
            {error}
          </div>
        )}

        {successSent ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-neutral-900">Check Your Email</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                If an account exists for this email address, a password reset link has been sent. Please check your inbox and spam folder.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 bg-[#DE1B76] hover:bg-[#c41465] text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer text-sm"
            >
              {submitting ? (
                <span className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Reset Link...</span>
                </span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-[#DE1B76] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center space-x-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Secure Password Recovery</span>
        </div>
      </div>
    </div>
  );
}
