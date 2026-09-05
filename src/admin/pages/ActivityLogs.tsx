import { useCallback, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { AuditLogEntry } from '../types';
import { formatDateTime, normalizePage, timeAgo } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { actionLabel, actionMeta } from '../utils/activityMeta';
import { toneClasses } from '../utils/status';

const PAGE_SIZE = 25;

const ACTIONS = [
  { value: '', label: 'All actions' },
  { value: 'USER_REGISTERED', label: 'User registered' },
  { value: 'USER_VERIFIED', label: 'User email verified' },
  { value: 'USER_STATUS_CHANGED', label: 'User status changed' },
  { value: 'USER_PROFILE_UPDATED', label: 'Profile updated' },
  { value: 'OTP_REQUESTED', label: 'Code requested' },
  { value: 'OTP_VERIFIED', label: 'Code verified' },
  { value: 'LISTING_CREATED', label: 'Listing created' },
  { value: 'LISTING_UPDATED', label: 'Listing updated' },
  { value: 'LISTING_STATUS_CHANGED', label: 'Listing moderated' },
  { value: 'LISTING_DELETED', label: 'Listing deleted' },
  { value: 'APPLICATION_CREATED', label: 'Application submitted' },
  { value: 'APPLICATION_STATUS_CHANGED', label: 'Application updated' },
  { value: 'REPORT_CREATED', label: 'Report filed' },
  { value: 'REPORT_STATUS_CHANGED', label: 'Report moderated' },
  { value: 'CONVERSATION_CREATED', label: 'Conversation started' },
  { value: 'SERVICE_REQUEST_CREATED', label: 'Service requested' },
  { value: 'SERVICE_REQUEST_STATUS_CHANGED', label: 'Service request updated' },
  { value: 'ADMIN_ACTION', label: 'Admin action' },
];

const ENTITY_TYPES = [
  { value: '', label: 'All entity types' },
  { value: 'USER', label: 'User' },
  { value: 'VERIFICATION', label: 'Verification' },
  { value: 'LISTING', label: 'Listing' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'REPORT', label: 'Report' },
  { value: 'CONVERSATION', label: 'Conversation' },
  { value: 'SERVICE_REQUEST', label: 'Service request' },
];

export default function ActivityLogs() {
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(0);

  const load = useCallback(
    () => adminApi.activity(
      { action: action || undefined, entityType: entityType || undefined, search: debouncedSearch || undefined },
      page,
      PAGE_SIZE,
    ),
    [action, entityType, debouncedSearch, page],
  );
  const { data, loading, error, reload } = useAdminResource(load, [action, entityType, debouncedSearch, page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect label="Action" value={action} options={ACTIONS} onChange={value => { setAction(value); setPage(0); }} />
          <ToolbarSelect label="Entity" value={entityType} options={ENTITY_TYPES} onChange={value => { setEntityType(value); setPage(0); }} />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} event${flat.totalElements === 1 ? '' : 's'}` : 'Loading activity…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState rows={8} />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState
              icon={History}
              title="No activity recorded"
              message="Important platform events are written to the audit log automatically as they happen."
            />
          ) : (
            <>
              <ul className="divide-y divide-[var(--border-primary)]">
                {flat.content.map(entry => <LogRow key={entry.id} entry={entry} />)}
              </ul>
              <Pagination page={page} totalPages={flat.totalPages} totalElements={flat.totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LogRow({ entry }: { entry: AuditLogEntry }) {
  const meta = actionMeta(entry.action);
  const Icon = meta.icon;
  const tone = toneClasses[meta.tone];
  return (
    <li className="flex items-start gap-3.5 px-4 py-4 transition-colors hover:bg-[var(--bg-tertiary)]/40 sm:px-5">
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.badge}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-bold text-[var(--text-primary)]">{actionLabel(entry.action)}</span>
          {entry.entityType && (
            <span className="rounded-md bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
              {entry.entityType}
              {entry.entityId != null ? ` #${entry.entityId}` : ''}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] leading-snug text-[var(--text-secondary)]">{entry.description || 'No description'}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[var(--text-tertiary)]">
          <span className="font-medium text-[var(--text-secondary)]">
            {entry.actorName ? `${entry.actorName}${entry.actorEmail ? ` · ${entry.actorEmail}` : ''}` : 'System event'}
          </span>
          <span aria-hidden>·</span>
          <time dateTime={entry.createdAt ?? undefined} title={formatDateTime(entry.createdAt)}>{timeAgo(entry.createdAt)}</time>
        </div>
      </div>
    </li>
  );
}
