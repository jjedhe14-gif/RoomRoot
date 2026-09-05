import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ClipboardList, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../services/adminApi';
import type { AdminApplication } from '../types';
import { formatDateTime, formatMoney, normalizePage, timeAgo } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { StatusPill } from '../components/StatusPill';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { UserAvatar } from '../components/UserAvatar';

const PAGE_SIZE = 20;

export default function Applications() {
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);

  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<AdminApplication | null>(null);

  const load = useCallback(
    () => adminApi.applications(status || undefined, debouncedSearch || undefined, page, PAGE_SIZE),
    [status, debouncedSearch, page],
  );
  const { data, loading, error, reload } = useAdminResource(load, [status, debouncedSearch, page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect
            label="Status"
            value={status}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'WITHDRAWN', label: 'Withdrawn' },
            ]}
            onChange={value => { setStatus(value); setPage(0); }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} application${flat.totalElements === 1 ? '' : 's'}` : 'Loading applications…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No applications found" message="Applications will appear here when students apply to listings." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Applicant</Th>
                      <Th>Listing</Th>
                      <Th>Owner</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th>Updated</Th>
                      <Th className="text-right">View</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(app => (
                      <tr key={app.id} onClick={() => setSelected(app)} className="cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]/50">
                        <Td mono>#{app.id}</Td>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <UserAvatar name={app.student?.name} src={app.student?.avatarUrl} size="sm" />
                            <div className="min-w-0 max-w-[180px]">
                              <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{app.student?.name || '—'}</p>
                              <p className="truncate text-[11px] text-[var(--text-tertiary)]">{app.student?.email}</p>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <p className="max-w-[220px] truncate text-[13px] font-medium text-[var(--text-primary)]">{app.listing?.title || '—'}</p>
                        </Td>
                        <Td>
                          <span className="max-w-[140px] truncate text-[13px] text-[var(--text-secondary)]">{app.listing?.owner?.name || '—'}</span>
                        </Td>
                        <Td><StatusPill status={app.status} /></Td>
                        <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(app.createdAt)}>{timeAgo(app.createdAt)}</span></Td>
                        <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(app.updatedAt)}>{timeAgo(app.updatedAt)}</span></Td>
                        <Td>
                          <div className="flex justify-end">
                            <button
                              onClick={(event) => { event.stopPropagation(); setSelected(app); }}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
                              aria-label={`View application ${app.id}`}
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={flat.totalPages} totalElements={flat.totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </>
          )}
        </div>
      )}

      <ApplicationDetails app={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ApplicationDetails({ app, onClose }: { app: AdminApplication | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {app && (
        <motion.div className="fixed inset-0 z-[70] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
          <motion.aside
            className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Application #{app.id}</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)]">Application for “{app.listing?.title}”</h3>
                <div className="mt-2"><StatusPill status={app.status} /></div>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]" aria-label="Close details">
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/60 p-3.5">
              <UserAvatar name={app.student?.name} src={app.student?.avatarUrl} size="md" />
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[var(--text-primary)]">{app.student?.name}</p>
                <p className="truncate text-[12px] text-[var(--text-tertiary)]">{app.student?.email} · {app.student?.role}</p>
              </div>
            </div>

            <dl className="space-y-3 text-[13px]">
              <InfoRow label="Monthly rent"><strong>{formatMoney(app.listing?.monthlyRent)}</strong></InfoRow>
              <InfoRow label="Listing owner">{app.listing?.owner?.name || '—'}</InfoRow>
              <InfoRow label="Listing location">{[app.listing?.city, app.listing?.locality].filter(Boolean).join(' · ') || '—'}</InfoRow>
              <InfoRow label="Submitted">{formatDateTime(app.createdAt)}</InfoRow>
              <InfoRow label="Last updated">{formatDateTime(app.updatedAt)}</InfoRow>
              {app.message && (
                <div className="border-t border-[var(--border-primary)] pt-3">
                  <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Applicant message</dt>
                  <dd className="rounded-xl bg-[var(--bg-tertiary)]/70 p-3 leading-relaxed text-[var(--text-secondary)]">{app.message}</dd>
                </div>
              )}
            </dl>

            <p className="mt-auto pt-6 text-[12px] leading-relaxed text-[var(--text-tertiary)]">
              This is a monitoring view. Application decisions are made by the applicant (withdraw) or the listing owner (accept/reject).
            </p>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 pt-px text-[var(--text-tertiary)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--text-primary)]">{children}</dd>
    </div>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''}`}>{children}</td>;
}
