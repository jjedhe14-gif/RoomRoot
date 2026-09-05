import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { sendVerificationCode, verifyCode } from '../../services/authService';
import { useAppStore } from '../../stores/appStore';
import { useThemeStore } from '../../stores/themeStore';
import { adminErrorMessage } from '../services/adminApi';
import { Moon, Sun } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const authUser = useAppStore(state => state.authUser);
  const isAdmin = authUser?.role?.toUpperCase() === 'ADMIN';
  const setSession = useAppStore(state => state.setSession);
  const { resolved, setTheme } = useThemeStore();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already authenticated as an admin - straight to the console.
  if (isLoggedIn && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const requestCode = async () => {
    const target = email.trim().toLowerCase();
    if (!target || !target.includes('@')) {
      setError('Enter a valid administrator email address.');
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await sendVerificationCode(target);
      setStep('code');
      setNotice(`A 6-digit verification code was sent to ${target}.`);
    } catch (cause) {
      setError(adminErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnter = async () => {
    const target = email.trim().toLowerCase();
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const response = await verifyCode(target, code.trim(), undefined);
      const role = response.user?.role?.toUpperCase();
      if (role !== 'ADMIN') {
        setError('This account is not an administrator. Access to the admin console requires the ADMIN role.');
        return;
      }
      setSession(response.token, response.user);
      navigate('/admin/dashboard', { replace: true });
    } catch (cause) {
      setError(adminErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setTheme(resolved === 'dark' ? 'light' : 'dark');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 py-10">
      {/* Soft backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(66,99,235,0.14),transparent_34%),radial-gradient(circle_at_85%_85%,rgba(20,184,166,0.08),transparent_30%)]" />

      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 rounded-xl p-2.5 text-[var(--text-secondary)] ring-1 ring-[var(--border-primary)] transition hover:bg-[var(--bg-tertiary)]"
        aria-label="Toggle color theme"
      >
        {resolved === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative w-full max-w-[420px]">
        <div className="mb-7 text-center">
          <img src="/logo.svg" alt="RoomRoot" className="mx-auto mb-4 h-14 w-14 object-contain" />
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 ring-1 ring-inset ring-brand-600/20 dark:bg-brand-500/10 dark:text-brand-300">
            <ShieldCheck size={12} /> Admin Console
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Sign in to RoomRoot Admin</h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Restricted to accounts with the <span className="font-semibold">ADMIN</span> role.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-lg shadow-black/[0.03] sm:p-7">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200/70 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-xl border border-brand-200/70 bg-brand-50 px-3.5 py-2.5 text-[13px] font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">
              {notice}
            </div>
          )}

          {step === 'email' ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">Administrator email</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={event => { setEmail(event.target.value); setError(null); }}
                    onKeyDown={event => { if (event.key === 'Enter') void requestCode(); }}
                    placeholder="admin@roomroot.app"
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
              <button
                onClick={() => void requestCode()}
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {loading ? 'Sending code…' : 'Send verification code'}
              </button>
              <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-[var(--text-tertiary)]">
                <Lock size={11} /> Secured with the same passwordless email verification used by RoomRoot
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--text-secondary)]">Verification code</label>
                <input
                  inputMode="numeric"
                  value={code}
                  onChange={event => { setCode(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(null); }}
                  onKeyDown={event => { if (event.key === 'Enter') void verifyAndEnter(); }}
                  placeholder="123456"
                  className="h-11 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 text-center text-lg font-bold tracking-[0.5em] text-[var(--text-primary)] outline-none transition placeholder:tracking-normal placeholder:text-[var(--text-tertiary)] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  autoFocus
                />
              </div>
              <button
                onClick={() => void verifyAndEnter()}
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {loading ? 'Verifying…' : 'Verify & enter console'}
              </button>
              <button
                onClick={() => { setStep('email'); setCode(''); setNotice(null); }}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                <ArrowLeft size={13} /> Use a different email
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 text-center text-[12px] text-[var(--text-tertiary)]">
          Not an administrator? <a href="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">Go to RoomRoot sign in</a>
        </div>
      </div>
    </div>
  );
}
