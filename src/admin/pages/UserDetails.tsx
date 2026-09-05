import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  BookOpen,
  Building2,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Star,
  UserX,
} from 'lucide-react';
import { adminApi, adminErrorMessage } from '../services/adminApi';
import type { AdminUserDetail } from '../types';
import { useAdminResource } from '../hooks/useAdminResource';
import { useToastStore } from '../../stores/toastStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState, LoadingState } from '../components/PageState';
import { StatusPill } from '../components/StatusPill';
import { UserAvatar } from '../components/UserAvatar';
import { formatDate, formatDateTime, formatMoney, titleCase } from '../utils/format';
import { roleTone, toneClasses } from '../utils/status';

type StatusAction = 'ACTIVE' | 'SUSPENDED' | null;

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const { data: user, loading, error, reload } = useAdminResource(
    () => adminApi.userDetail(String(id)),
    [id],
  );

  const [pendingAction, setPendingAction] = useState<StatusAction>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [busy, setBusy] = useState(false);

  const runAction = async () => {
    if (!pendingAction || !user) return;
    setBusy(true);
    try {
      if (pendingAction === 'SUSPENDED' && !suspensionReason.trim()) {
        addToast('Enter the reason the user will receive.', 'error');
        return;
      }
      await adminApi.updateUserStatus(user.id, pendingAction, pendingAction === 'SUSPENDED' ? suspensionReason.trim() : undefined);
      addToast(`${user.name}'s account is now ${pendingAction === 'ACTIVE' ? 'active' : 'suspended'}.`, 'success');
      setPendingAction(null);
      setSuspensionReason('');
      reload();
    } catch (cause) {
      addToast(adminErrorMessage(cause), 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !user) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingState label="Loading user details…" /></div>;
  }

  if (error && !user) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (!user) return null;

  const canSuspend = user.status === 'ACTIVE';
  const roleClasses = toneClasses[roleTone(user.role)];

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/admin/users')}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={15} /> Back to users
      </button>

      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
        <div className="h-20 bg-gradient-to-r from-brand-500/15 via-brand-400/10 to-emerald-400/10" />
        <div className="-mt-8 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="rounded-2xl ring-4 ring-[var(--bg-secondary)]">
              <UserAvatar name={user.name} src={user.avatarUrl} size="md" />
              <div className="hidden" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">{user.name}</h2>
                <StatusPill status={user.status} />
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${roleClasses.badge}`}>
                  {user.role === 'ADMIN' && <ShieldCheck size={11} />}
                  {titleCase(user.role)}
                </span>
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck size={13} /> Verified email
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
                <Mail size={13} className="text-[var(--text-tertiary)]" /> {user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            {canSuspend ? (
              <button
                onClick={() => setPendingAction('SUSPENDED')}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-amber-500/10 px-3.5 text-[13px] font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/30 transition hover:bg-amber-500/20 dark:text-amber-400"
              >
                <UserX size={14} /> Suspend account
              </button>
            ) : (
              <button
                onClick={() => setPendingAction('ACTIVE')}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 text-[13px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <ShieldCheck size={14} /> Activate account
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Profile details */}
        <section className="space-y-5">
          <DetailPanel title="Account & verification">
            <DetailRow icon={BadgeCheck} label="Email verified">{user.emailVerified ? 'Yes' : 'No'}</DetailRow>
            <DetailRow icon={PencilLine} label="Registration">{user.createdAt ? formatDateTime(user.createdAt) : 'Pre-tracking (legacy account)'}</DetailRow>
            <DetailRow icon={ShieldCheck} label="Role">{titleCase(user.role)}</DetailRow>
            {user.phone && <DetailRow icon={Phone} label="Phone">{user.phone}</DetailRow>}
          </DetailPanel>

          <DetailPanel title="Education">
            <DetailRow icon={Building2} label="University">{user.university || '—'}</DetailRow>
            <DetailRow icon={BookOpen} label="Course">{user.course || '—'}</DetailRow>
            {user.yearOfStudy != null && <DetailRow icon={BookOpen} label="Year of study">{String(user.yearOfStudy)}</DetailRow>}
          </DetailPanel>

          <DetailPanel title="Housing preferences">
            <DetailRow icon={Banknote} label="Budget">{user.budget != null ? formatMoney(user.budget) : '—'}</DetailRow>
            <DetailRow icon={MapPin} label="Preferred location">{user.preferredLocation || '—'}</DetailRow>
            <DetailRow icon={Home} label="Gender preference">{user.genderPreference ? titleCase(user.genderPreference) : '—'}</DetailRow>
          </DetailPanel>

          {user.bio && (
            <DetailPanel title="Bio">
              <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{user.bio}</p>
            </DetailPanel>
          )}
        </section>

        {/* Engagement summary */}
        <aside className="space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Platform engagement</p>
          <div className="grid grid-cols-2 gap-3">
            <EngageStat icon={Home} label="Listings" value={user.totalListings} to="/admin/listings" />
            <EngageStat icon={FileText} label="Applications" value={user.totalApplications} to="/admin/applications" />
            <EngageStat icon={Heart} label="Favorites" value={user.totalFavorites} to="/admin/users" />
            <EngageStat icon={Star} label="Reviews" value={user.totalReviews} to="/admin/users" />
          </div>

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 text-[13px] leading-relaxed text-[var(--text-secondary)] shadow-sm">
            <p className="mb-1 text-[12px] font-bold text-[var(--text-primary)]">Activity audit</p>
            Suspend, activate and status changes made here are recorded to the activity log with your administrator identity.
            <Link to="/admin/activity" className="mt-2 block font-semibold text-brand-600 hover:underline dark:text-brand-400">Open activity log →</Link>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={pendingAction === 'SUSPENDED' ? `Suspend ${user.name}?` : `Activate ${user.name}?`}
        description={
          pendingAction === 'SUSPENDED'
            ? `${user.name} will not be able to sign in or use RoomRoot until reactivated.`
            : `Full platform access will be restored for ${user.name}.`
        }
        input={pendingAction === 'SUSPENDED' ? {
          label: 'Reason shown to the user',
          value: suspensionReason,
          onChange: setSuspensionReason,
          placeholder: 'Explain why this account is being suspended',
        } : undefined}
        confirmLabel={pendingAction === 'SUSPENDED' ? 'Suspend account' : 'Activate account'}
        danger={pendingAction === 'SUSPENDED'}
        busy={busy}
        onConfirm={() => void runAction()}
        onClose={() => { if (!busy) { setPendingAction(null); setSuspensionReason(''); } }}
      />
    </div>
  );
}

function DetailPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 shadow-sm">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[var(--text-tertiary)]">{title}</h3>
      <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <Icon size={14} className="mt-0.5 shrink-0 text-[var(--text-tertiary)]" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
        <p className="text-[13px] font-medium text-[var(--text-primary)]">{children}</p>
      </div>
    </div>
  );
}

function EngageStat({ icon: Icon, label, value, to }: { icon: typeof Home; label: string; value: number; to: string }) {
  return (
    <Link to={to} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 transition hover:border-brand-300 dark:hover:border-brand-500/40">
      <Icon size={15} className="mb-2 text-[var(--text-tertiary)]" />
      <p className="text-xl font-bold tabular-nums text-[var(--text-primary)]">{value}</p>
      <p className="text-[11px] font-medium text-[var(--text-tertiary)]">{label}</p>
    </Link>
  );
}
