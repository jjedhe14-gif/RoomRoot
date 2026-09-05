import {
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAdminResource } from '../hooks/useAdminResource';
import { adminApi } from '../services/adminApi';
import { ErrorState, LoadingState } from '../components/PageState';
import { formatDateTime } from '../utils/format';

const ENTITY_ORDER = [
  'Users',
  'Listings',
  'Applications',
  'Verification Codes',
  'Conversations',
  'Messages',
  'Notifications',
  'Favorites',
  'Reviews',
  'Reports',
  'Audit Log Entries',
];

export default function SystemOverview() {
  const authUser = useAppStore(state => state.authUser);
  const { data, loading, error, reload, refreshing } = useAdminResource(() => adminApi.systemOverview(), [], 45_000);

  if (loading && !data) {
    return (
      <div className="space-y-5">
        <Title onRefresh={reload} refreshing={false} />
        <LoadingState label="Querying backend health…" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-5">
        <Title onRefresh={reload} refreshing={false} />
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const overview = data!;
  const serviceOk = overview.status === 'UP';
  const dbOk = overview.databaseStatus === 'UP';

  const records = ENTITY_ORDER
    .filter(key => key in overview.recordCounts)
    .map(key => ({ label: key, value: overview.recordCounts[key] }));

  return (
    <div className="space-y-5">
      <Title onRefresh={reload} refreshing={refreshing} />

      {/* Status row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard
          icon={Server}
          label="Backend service"
          ok={serviceOk}
          detail={serviceOk ? 'Responding normally' : 'Service degraded'}
          toneOk="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          toneBad="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
        <StatusCard
          icon={Database}
          label="Database"
          ok={dbOk}
          detail={dbOk ? 'Connected to MySQL' : 'Connection failed'}
          toneOk="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          toneBad="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
        <StatusCard
          icon={Cpu}
          label="Runtime"
          ok
          detail={`Java ${overview.javaVersion}`}
          toneOk="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          toneBad="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
      </div>

      {/* Service meta */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetaCard label="Service" value={overview.service} />
        <MetaCard label="API version" value={`${overview.apiVersion} · app ${overview.applicationVersion}`} />
        <MetaCard label="Server time" value={overview.serverTime ? formatDateTime(overview.serverTime) : '—'} />
      </div>

      {/* Record counts */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">Database records</h2>
            <p className="text-xs text-[var(--text-tertiary)]">Live row counts per platform entity</p>
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">Auto-refreshes every 45s</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {records.map(record => (
            <div key={record.label} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3.5 shadow-sm">
              <p className="text-[13px] font-medium text-[var(--text-secondary)]">{record.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
                {record.value.toLocaleString()}
              </p>
            </div>
          ))}
          <HardDriveCard signedInAs={authUser?.email} />
        </div>
      </section>

      <p className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
        No credentials, JWT secrets or raw configuration values are exposed by this view. Health data is read-only.
      </p>
    </div>
  );
}

function Title({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">System overview</h2>
        <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">Backend health, version and platform record counts.</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
      >
        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
      </button>
    </div>
  );
}

interface StatusCardProps {
  icon: typeof Server;
  label: string;
  ok: boolean;
  detail: string;
  toneOk: string;
  toneBad: string;
}

function StatusCard({ icon: Icon, label, ok, detail, toneOk, toneBad }: StatusCardProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ok ? toneOk : toneBad}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[14px] font-bold text-[var(--text-primary)]">{label}</p>
          {ok ? (
            <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
          ) : (
            <XCircle size={14} className="shrink-0 text-red-500" />
          )}
        </div>
        <p className="truncate text-[12px] text-[var(--text-tertiary)]">{detail}</p>
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-wide ${ok ? 'text-emerald-500' : 'text-red-500'}`}>
        {ok ? 'Up' : 'Down'}
      </span>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3.5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 truncate text-[14px] font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function HardDriveCard({ signedInAs }: { signedInAs?: string | null }) {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[var(--border-primary)] bg-transparent px-4 py-3.5">
      <HardDrive size={15} className="mb-1.5 text-[var(--text-tertiary)]" />
      <p className="text-[13px] font-medium text-[var(--text-secondary)]">Signed in as</p>
      <p className="mt-0.5 truncate text-[12px] font-semibold text-[var(--text-primary)]">{signedInAs || 'Administrator'}</p>
    </div>
  );
}
