import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  ClipboardList,
  FileClock,
  Home,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { StatCard, type StatTone } from '../components/StatCard';
import { ErrorState, LoadingState } from '../components/PageState';
import { useAdminResource } from '../hooks/useAdminResource';
import { adminApi } from '../services/adminApi';
import type { AdminStats, AuditLogEntry } from '../types';
import { normalizePage, timeAgo, titleCase } from '../utils/format';
import { toneClasses } from '../utils/status';
import { actionMeta } from '../utils/activityMeta';
import { adminNav } from '../nav';

export default function Dashboard() {
  const authUser = useAppStore(state => state.authUser);
  const statsResource = useAdminResource(() => adminApi.stats(), [], 60_000);
  const activityResource = useAdminResource(
    () => adminApi.activity({}, 0, 14),
    [],
    60_000,
  );

  const loading = statsResource.loading || activityResource.loading;
  const error = statsResource.error || activityResource.error;
  const reload = () => {
    statsResource.reload();
    activityResource.reload();
  };
  const refreshing = statsResource.refreshing || activityResource.refreshing;

  if (loading && !statsResource.data) {
    return (
      <div className="space-y-6">
        <HeaderRow greeting={greeting(authUser?.name)} onRefresh={reload} refreshing={false} />
        <LoadingState label="Loading platform overview…" />
      </div>
    );
  }

  if (error && !statsResource.data) {
    return (
      <div className="space-y-6">
        <HeaderRow greeting={greeting(authUser?.name)} onRefresh={reload} refreshing={false} />
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const stats = statsResource.data;
  const page = activityResource.data ? normalizePage(activityResource.data) : null;

  return (
    <div className="space-y-7">
      <HeaderRow greeting={greeting(authUser?.name)} onRefresh={reload} refreshing={refreshing} />

      {error && statsResource.data && (
        <div className="rounded-xl border border-amber-200/70 bg-amber-50 px-4 py-2.5 text-[13px] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          {error}
        </div>
      )}

      {/* Priority row */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} tone="brand" hint={`${stats.newUsersLast7Days} new this week`} />
          <StatCard label="Active Listings" value={stats.activeListings} icon={Home} tone="green" hint={`${stats.pendingListings} pending review`} />
          <StatCard label="Pending Applications" value={stats.pendingApplications} icon={ClipboardList} tone="blue" />
          <StatCard label="Open Reports" value={stats.pendingReports} icon={AlertTriangle} tone="red" />
          <StatCard label="Messages Sent" value={stats.totalMessages} icon={MessageSquare} tone="teal" />
          <StatCard label="Events (24h)" value={stats.eventsLast24Hours} icon={FileClock} tone="violet" hint={`${stats.eventsLast7Days} this week`} />
        </div>
      )}

      {stats && (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Activity feed */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">Recent activity</h2>
                <p className="text-xs text-[var(--text-tertiary)]">Latest platform events from the audit log</p>
              </div>
              <Link
                to="/admin/activity"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
              >
                View all <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
              {page && page.content.length > 0 ? (
                <ol className="divide-y divide-[var(--border-primary)]">
                  {page.content.map(entry => <ActivityRow key={entry.id} entry={entry} />)}
                </ol>
              ) : (
                <p className="px-5 py-12 text-center text-sm text-[var(--text-tertiary)]">
                  No activity recorded yet. Events will appear here as users sign up, verify emails and create listings.
                </p>
              )}
            </div>
          </section>

          {/* Secondary stats */}
          <section className="space-y-4">
            <MiniPanel
              title="User health"
              items={[
                { label: 'Verified emails', value: stats.verifiedUsers, icon: BadgeCheck, tone: 'green' },
                { label: 'Unverified accounts', value: stats.unverifiedUsers, icon: UserPlus, tone: 'amber' },
                { label: 'Suspended accounts', value: stats.suspendedUsers, icon: UserX, tone: 'red' },
              ]}
              to="/admin/users"
            />
            <MiniPanel
              title="Moderation queue"
              items={[
                { label: 'Listings pending review', value: stats.pendingListings, icon: ShieldCheck, tone: 'amber' },
                { label: 'Reports open', value: stats.pendingReports, icon: AlertTriangle, tone: 'red' },
                { label: 'Reports reviewing', value: stats.reviewingReports, icon: CheckCircle2, tone: 'blue' },
              ]}
              to="/admin/reports"
            />
            <MiniPanel
              title="Communication"
              items={[
                { label: 'Conversations', value: stats.totalConversations, icon: MessageSquare, tone: 'teal' },
                { label: 'Notifications sent', value: stats.totalNotifications, icon: BellRing, tone: 'violet' },
              ]}
              to="/admin/conversations"
            />
          </section>
        </div>
      )}

      {/* Quick shortcuts */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {adminNav.filter(item => item.to !== '/admin/dashboard').map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3.5 py-3 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
          >
            <item.icon size={16} className="shrink-0 text-[var(--text-tertiary)] transition group-hover:text-brand-500" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function greeting(name?: string | null): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${time}, ${name.split(' ')[0]}` : `${time}`;
}

function HeaderRow({ greeting: g, onRefresh, refreshing }: { greeting: string; onRefresh: () => void; refreshing: boolean }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">{g}</h2>
        <p className="mt-0.5 text-[13px] text-[var(--text-tertiary)]">Here's what's happening across RoomRoot.</p>
      </div>
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
        disabled={refreshing}
      >
        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
      </button>
    </div>
  );
}

function ActivityRow({ entry }: { entry: AuditLogEntry }) {
  const meta = actionMeta(entry.action);
  const Icon = meta.icon;
  const tone = toneClasses[meta.tone];
  return (
    <li className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--bg-tertiary)]/60">
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.badge}`}>
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--text-primary)]">{titleCase(entry.action)}</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[var(--text-secondary)]">
          {entry.description || 'No description'}
        </p>
        <p className="mt-1 flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
          <span className="truncate">{entry.actorName || 'System'}</span>
          <span aria-hidden>·</span>
          <time dateTime={entry.createdAt ?? undefined}>{timeAgo(entry.createdAt)}</time>
        </p>
      </div>
    </li>
  );
}

interface MiniPanelItem {
  label: string;
  value: number;
  icon: typeof Users;
  tone: StatTone;
}

function MiniPanel({ title, items, to }: { title: string; items: MiniPanelItem[]; to: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-[var(--text-primary)]">{title}</h3>
        <Link to={to} className="text-[var(--text-tertiary)] transition hover:text-brand-500" aria-label={`Open ${title}`}>
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="space-y-2.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <item.icon size={14} className="text-[var(--text-tertiary)]" />
              {item.label}
            </span>
            <span className="text-[15px] font-bold tabular-nums text-[var(--text-primary)]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
