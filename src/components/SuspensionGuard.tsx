import { useEffect, useState } from 'react';
import { Ban, LogOut, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, submitSuspensionAppeal, type BackendUser } from '../services/authService';
import { useAppStore } from '../stores/appStore';
import { useToastStore } from '../stores/toastStore';

/** Keeps a suspended member behind a non-dismissible ban notice, even mid-session. */
export function SuspensionGuard() {
  const navigate = useNavigate();
  const authUser = useAppStore(state => state.authUser);
  const logout = useAppStore(state => state.logout);
  const updateProfile = useAppStore(state => state.updateProfile);
  const { addToast } = useToastStore();
  const [suspendedUser, setSuspendedUser] = useState<BackendUser | null>(
    authUser?.status === 'SUSPENDED' ? authUser : null,
  );
  const [appealing, setAppealing] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authUser || authUser.role?.toUpperCase() === 'ADMIN') return;
    let active = true;
    const refresh = async () => {
      try {
        const user = await getCurrentUser();
        if (!active) return;
        updateProfile(user);
        if (user.status === 'SUSPENDED') setSuspendedUser(user);
      } catch {
        // A transient backend failure must not log the member out.
      }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 10_000);
    return () => { active = false; window.clearInterval(interval); };
  }, [authUser?.id, authUser?.role, updateProfile]);

  if (!suspendedUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sendAppeal = async () => {
    if (!message.trim()) {
      addToast('Please explain why you are appealing this suspension.', 'error');
      return;
    }
    try {
      setSending(true);
      await submitSuspensionAppeal(message.trim());
      setMessage('');
      setAppealing(false);
      addToast('Your appeal request has been sent for administrator review.', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to send your appeal.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="suspension-title">
      <section className="w-full max-w-md rounded-3xl border border-red-200 bg-[var(--bg-secondary)] p-6 shadow-2xl dark:border-red-500/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"><Ban size={24} /></div>
        <h1 id="suspension-title" className="mt-5 text-xl font-bold text-[var(--text-primary)]">You have been banned from the app</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Your RoomRoot account is suspended and you cannot use the app while this is reviewed.</p>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-100">
          <span className="font-bold">Reason: </span>{suspendedUser.suspensionReason || 'No reason was provided.'}
        </div>

        {appealing ? (
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-[var(--text-primary)]" htmlFor="appeal-message">Appeal request</label>
            <textarea id="appeal-message" value={message} onChange={event => setMessage(event.target.value)} maxLength={1000} rows={4} placeholder="Tell the administrator why this suspension should be reviewed." className="w-full resize-none rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
            <div className="flex gap-2">
              <button onClick={() => setAppealing(false)} disabled={sending} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Back</button>
              <button onClick={() => void sendAppeal()} disabled={sending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Send size={15} />{sending ? 'Sending…' : 'Send appeal'}</button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button onClick={handleLogout} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"><LogOut size={16} />Logout</button>
            <button onClick={() => setAppealing(true)} className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Appeal request</button>
          </div>
        )}
      </section>
    </div>
  );
}
