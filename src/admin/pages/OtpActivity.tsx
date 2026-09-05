import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { BadgeCheck, Clock, Lock, ShieldCheck, TimerOff } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { VerificationEntry, VerificationStatus } from '../types';
import { formatDateTime, normalizePage, timeAgo } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { StatusPill } from '../components/StatusPill';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All states' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'USED', label: 'Used' },
  { value: 'EXPIRED', label: 'Expired' },
];

export default function OtpActivity() {
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);

  const load = useCallback(
    () => adminApi.verifications(debouncedSearch || undefined, (status || undefined) as VerificationStatus | undefined, page, PAGE_SIZE),
    [debouncedSearch, status, page],
  );
  const { data, loading, error, reload } = useAdminResource(load, [debouncedSearch, status, page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  return (
    <div className="space-y-4">
      {/* Security note */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-[13px] leading-relaxed text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-200">
        <Lock size={15} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Security note:</span> OTP codes are single-use, expire after 5 minutes, and are{' '}
          <span className="font-semibold">never displayed or exposed through any API</span>. This page shows lifecycle metadata only.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect
            label="Code state"
            value={status}
            options={STATUS_OPTIONS}
            onChange={value => { setStatus(value); setPage(0); }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} code${flat.totalElements === 1 ? '' : 's'}` : 'Loading…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No verification activity"
              message="Email verification requests will appear here when users sign in or create accounts."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Email</Th>
                      <Th>State</Th>
                      <Th>Outcome</Th>
                      <Th>Requested</Th>
                      <Th>Expires</Th>
                      <Th>Consumed at</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(entry => <VerificationRow key={entry.id} entry={entry} />)}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={flat.totalPages} totalElements={flat.totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function VerificationRow({ entry }: { entry: VerificationEntry }) {
  return (
    <tr className="transition-colors hover:bg-[var(--bg-tertiary)]/40">
      <Td mono>#{entry.id}</Td>
      <Td>
        <span className="text-[13px] font-medium text-[var(--text-primary)]">{entry.email}</span>
      </Td>
      <Td><StatusPill status={entry.status} /></Td>
      <Td>
        {entry.verified ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
            <BadgeCheck size={13} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-tertiary)]">
            {entry.status === 'EXPIRED' ? <TimerOff size={13} /> : <Clock size={13} />}
            {entry.status === 'EXPIRED' ? 'Not used' : 'Awaiting'}
          </span>
        )}
      </Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(entry.createdAt)}>{timeAgo(entry.createdAt)}</span></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]">{formatDateTime(entry.expiresAt)}</span></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]">{entry.usedAt ? formatDateTime(entry.usedAt) : '—'}</span></Td>
    </tr>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''}`}>{children}</td>;
}
