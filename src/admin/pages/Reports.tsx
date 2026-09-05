import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Eye, Flag, Scale, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi, adminErrorMessage } from '../services/adminApi';
import type { AdminReport } from '../types';
import { formatDateTime, normalizePage, timeAgo } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useToastStore } from '../../stores/toastStore';
import { StatusPill } from '../components/StatusPill';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { UserAvatar } from '../components/UserAvatar';

const PAGE_SIZE = 20;
type ReportAction = 'REVIEWING' | 'RESOLVED' | 'DISMISSED';

export default function Reports() {
  const { addToast } = useToastStore();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState<{ report: AdminReport; action: ReportAction } | null>(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<AdminReport | null>(null);

  const load = useCallback(
    () => adminApi.reports(status || undefined, page, PAGE_SIZE),
    [status, page],
  );
  const { data, loading, error, reload } = useAdminResource(load, [status, page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  const runAction = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await adminApi.updateReportStatus(confirm.report.id, confirm.action);
      addToast(`Report #${confirm.report.id} marked as ${confirm.action.toLowerCase()}.`, 'success');
      setConfirm(null);
      if (selected?.id === confirm.report.id) setSelected(null);
      reload();
    } catch (cause) {
      addToast(adminErrorMessage(cause), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect
            label="Status"
            value={status}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'PENDING', label: 'Open' },
              { value: 'REVIEWING', label: 'Reviewing' },
              { value: 'RESOLVED', label: 'Resolved' },
              { value: 'DISMISSED', label: 'Dismissed' },
            ]}
            onChange={value => { setStatus(value); setPage(0); }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} report${flat.totalElements === 1 ? '' : 's'}` : 'Loading reports…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState icon={Flag} title="No reports found" message="Reports filed by users against listings or other users will show up here." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Reason</Th>
                      <Th>Reporter</Th>
                      <Th>Target</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(report => (
                      <ReportRow
                        key={report.id}
                        report={report}
                        onView={() => setSelected(report)}
                        onReview={() => setConfirm({ report, action: 'REVIEWING' })}
                        onResolve={() => setConfirm({ report, action: 'RESOLVED' })}
                        onDismiss={() => setConfirm({ report, action: 'DISMISSED' })}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} totalPages={flat.totalPages} totalElements={flat.totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </>
          )}
        </div>
      )}

      <ReportDetails report={selected} onClose={() => setSelected(null)} />

      <ConfirmDialog
        open={confirm !== null}
        title={confirm ? `Mark report #${confirm.report.id} ${confirm.action === 'REVIEWING' ? 'as reviewing' : confirm.action.toLowerCase()}` : ''}
        description={
          confirm
            ? confirm.action === 'RESOLVED'
              ? 'Resolving a report indicates the issue has been investigated and action taken.'
              : confirm.action === 'DISMISSED'
                ? 'Dismissing closes the report without further action.'
                : 'Marks the report as actively being investigated.'
            : undefined
        }
        confirmLabel={confirm ? (confirm.action === 'REVIEWING' ? 'Start reviewing' : confirm.action.toLowerCase()) : 'Confirm'}
        danger={confirm?.action === 'DISMISSED'}
        busy={busy}
        onConfirm={() => void runAction()}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
    </div>
  );
}

function ReportRow({ report, onView, onReview, onResolve, onDismiss }: {
  report: AdminReport;
  onView: () => void;
  onReview: () => void;
  onResolve: () => void;
  onDismiss: () => void;
}) {
  const target = report.listing ? `Listing: ${report.listing.title}` : report.targetName ? `Listing: ${report.targetName}` : report.reportedUser ? `User: ${report.reportedUser.name}` : '—';
  const open = report.status === 'PENDING';
  return (
    <tr onClick={onView} className="cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]/50">
      <Td mono>#{report.id}</Td>
      <Td>
        <p className="max-w-[220px] truncate text-[13px] font-semibold text-[var(--text-primary)]">{report.reason}</p>
      </Td>
      <Td>
        <div className="flex items-center gap-2">
          <UserAvatar name={report.reporter?.name} src={report.reporter?.avatarUrl} size="xs" />
          <span className="max-w-[130px] truncate text-[13px] text-[var(--text-secondary)]">{report.reporter?.name || '—'}</span>
        </div>
      </Td>
      <Td><span className="max-w-[220px] truncate text-[13px] text-[var(--text-secondary)]">{target}</span></Td>
      <Td><StatusPill status={report.status} /></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(report.createdAt)}>{timeAgo(report.createdAt)}</span></Td>
      <Td>
        <div className="flex justify-end gap-1" onClick={event => event.stopPropagation()}>
          <button onClick={onView} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]" title="View details"><Eye size={14} /></button>
          {open && <ReportActionButton label="Review" icon={<Scale size={13} />} tone="blue" onClick={onReview} />}
          {open && <ReportActionButton label="Resolve" icon={<CheckCircle2 size={13} />} tone="green" onClick={onResolve} />}
          <ReportActionButton label="Dismiss" icon={<X size={13} />} tone="red" onClick={onDismiss} />
        </div>
      </Td>
    </tr>
  );
}

function ReportActionButton({ label, icon, tone, onClick }: { label: string; icon: ReactNode; tone: 'blue' | 'green' | 'red'; onClick: () => void }) {
  const tones = {
    blue: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10',
    green: 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10',
    red: 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10',
  };
  return (
    <button onClick={onClick} title={label} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${tones[tone]}`}>
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function ReportDetails({ report, onClose }: { report: AdminReport | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {report && (
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
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Report #{report.id}</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)]">{report.reason}</h3>
                <div className="mt-2"><StatusPill status={report.status} /></div>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]" aria-label="Close details"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/60 p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Reporter</p>
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={report.reporter?.name} src={report.reporter?.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[var(--text-primary)]">{report.reporter?.name || '—'}</p>
                    <p className="truncate text-[11px] text-[var(--text-tertiary)]">{report.reporter?.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/60 p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Reported target</p>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                  {report.listing ? `Listing — ${report.listing.title}` : report.targetName ? `Listing — ${report.targetName}` : report.reportedUser ? `User — ${report.reportedUser.name}` : 'Not specified'}
                </p>
                {report.listing && (
                  <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
                    {report.listing.owner?.name} · {formatMoneyShort(report.listing.monthlyRent)} · {[report.listing.city, report.listing.locality].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {report.description && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Details</p>
                  <p className="whitespace-pre-line rounded-xl bg-[var(--bg-tertiary)]/70 p-3.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{report.description}</p>
                </div>
              )}
              {report.targetAddress && <p className="mt-2 text-xs text-[var(--text-tertiary)]">{report.targetAddress}</p>}

              <p className="text-[12px] text-[var(--text-tertiary)]">Filed {formatDateTime(report.createdAt)}</p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatMoneyShort(value?: number | null): string {
  if (value == null) return 'Rent unavailable';
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}/mo`;
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''}`}>{children}</td>;
}
