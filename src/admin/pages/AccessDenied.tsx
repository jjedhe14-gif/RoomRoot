import { ExternalLink, LogOut, ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

export default function AccessDenied() {
  const navigate = useNavigate();
  const logout = useAppStore(state => state.logout);
  const authUser = useAppStore(state => state.authUser);

  const switchAccount = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <ShieldX size={26} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Access restricted</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          You're signed in as <span className="font-semibold text-[var(--text-primary)]">{authUser?.email || 'a non-admin user'}</span>.
          The RoomRoot admin console is only available to accounts with the <span className="font-semibold">ADMIN</span> role.
        </p>
        <div className="mt-6 grid gap-2.5">
          <button
            onClick={switchAccount}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <LogOut size={15} /> Sign in with an admin account
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
          >
            <ExternalLink size={15} /> Continue to RoomRoot app
          </a>
        </div>
      </div>
    </div>
  );
}
