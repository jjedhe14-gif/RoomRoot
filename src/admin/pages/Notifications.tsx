import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { AdminNotificationEntry } from '../types';
import { formatDateTime, normalizePage, timeAgo, titleCase } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { UserAvatar } from '../components/UserAvatar';
import { toneFor, toneClasses } from '../utils/status';

const PAGE_SIZE = 20;

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'VERIFICATION', label: 'Verification' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'APPLICATION_ACCEPTED', label: 'Application accepted' },
  { value: 'APPLICATION_REJECTED', label: 'Application rejected' },
  { value: 'MESSAGE', label: 'Message' },
  { value: 'LISTING', label: 'Listing' },
  { value: 'SYSTEM', label: 'System' },
];

export default function Notifications() {
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);
  const [type, setType] = useState('');
  const [read, setRead] = useState('');
  const [page, setPage] = useState(0);

  const load = useCallback(
    () => adminApi.notifications(
      type || undefined,
      read === 'true' ? true : read === 'false' ? false : undefined,
      page,
      PAGE_SIZE,
    ),
    [type, read, page, debouncedSearch],
  );
  const { data, loading, error, reload } = useAdminResource(load, [type, read, page, debouncedSearch]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect label="Type" value={type} options={TYPE_OPTIONS} onChange={value => { setType(value); setPage(0); }} />
          <ToolbarSelect
            label="Read state"
            value={read}
            options={[
              { value: '', label: 'Read state: all' },
              { value: 'true', label: 'Read' },
              { value: 'false', label: 'Unread' },
            ]}
            onChange={value => { setRead(value); setPage(0); }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} notification${flat.totalElements === 1 ? '' : 's'}` : 'Loading notifications…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications found" message="Platform notifications will appear here as users receive alerts." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Recipient</Th>
                      <Th>Title</Th>
                      <Th>Type</Th>
                      <Th>State</Th>
                      <Th>Sent</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(item => <NotificationRow key={item.id} item={item} />)}
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

function NotificationRow({ item }: { item: AdminNotificationEntry }) {
  const tone = toneFor(item.type);
  const classes = toneClasses[tone];
  // Message-type notification bodies carry private chat text; the API omits
  // message bodies entirely for the admin console.
  return (
    <tr className="transition-colors hover:bg-[var(--bg-tertiary)]/40">
      <Td mono>#{item.id}</Td>
      <Td>
        <div className="flex items-center gap-2.5">
          <UserAvatar name={item.recipient?.name} src={item.recipient?.avatarUrl} size="sm" />
          <div className="min-w-0 max-w-[170px]">
            <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{item.recipient?.name || '—'}</p>
            <p className="truncate text-[11px] text-[var(--text-tertiary)]">{item.recipient?.email}</p>
          </div>
        </div>
      </Td>
      <Td>
        <span className="max-w-[280px] truncate text-[13px] text-[var(--text-secondary)]">{item.title || '—'}</span>
      </Td>
      <Td>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${classes.badge}`}>
          {titleCase(item.type)}
        </span>
      </Td>
      <Td>
        {item.read ? (
          <span className="text-[12px] font-medium text-[var(--text-tertiary)]">Read</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-600 dark:text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Unread
          </span>
        )}
      </Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(item.createdAt)}>{timeAgo(item.createdAt)}</span></Td>
    </tr>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''}`}>{children}</td>;
}
