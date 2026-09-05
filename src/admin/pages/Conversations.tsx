import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Home, Lock, MessagesSquare } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { AdminConversation } from '../types';
import { formatNumber, formatDateTime, normalizePage, timeAgo } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { Pagination } from '../components/Pagination';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { UserAvatar } from '../components/UserAvatar';

const PAGE_SIZE = 20;

export default function Conversations() {
  const [page, setPage] = useState(0);
  const load = useCallback(() => adminApi.conversations(page, PAGE_SIZE), [page]);
  const { data, loading, error, reload } = useAdminResource(load, [page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  return (
    <div className="space-y-4">
      {/* Privacy note */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200/70 bg-blue-50/70 px-4 py-3 text-[13px] leading-relaxed text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-200">
        <Lock size={15} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Privacy note:</span> private message content is never exposed. This view shows conversation{' '}
          <span className="font-semibold">metadata only</span> — participants, related listing, message volume and activity times.
        </p>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} conversation${flat.totalElements === 1 ? '' : 's'}` : 'Loading conversations…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState icon={MessagesSquare} title="No conversations yet" message="Direct conversations between students and owners will appear here." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Participants</Th>
                      <Th>Related listing</Th>
                      <Th>Messages</Th>
                      <Th>Created</Th>
                      <Th>Last activity</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(conv => <ConversationRow key={conv.id} conv={conv} />)}
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

function ConversationRow({ conv }: { conv: AdminConversation }) {
  return (
    <tr className="transition-colors hover:bg-[var(--bg-tertiary)]/40">
      <Td mono>#{conv.id}</Td>
      <Td>
        <div className="flex items-center gap-2">
          <ParticipantPill user={conv.participant1} />
          <span className="text-[11px] text-[var(--text-tertiary)]">↔</span>
          <ParticipantPill user={conv.participant2} />
        </div>
      </Td>
      <Td>
        {conv.listingTitle ? (
          <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
            <Home size={12} className="shrink-0 text-[var(--text-tertiary)]" />
            <span className="max-w-[200px] truncate">{conv.listingTitle}</span>
            {conv.listingId != null && <span className="font-mono text-[10px] text-[var(--text-tertiary)]">#{conv.listingId}</span>}
          </span>
        ) : (
          <span className="text-[13px] text-[var(--text-tertiary)]">General</span>
        )}
      </Td>
      <Td>
        <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-[var(--bg-tertiary)] px-2 text-[12px] font-bold tabular-nums text-[var(--text-secondary)]">
          {formatNumber(conv.messageCount)}
        </span>
      </Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]" title={formatDateTime(conv.createdAt)}>{timeAgo(conv.createdAt)}</span></Td>
      <Td><span className="text-[13px] font-medium text-[var(--text-primary)]" title={formatDateTime(conv.updatedAt)}>{timeAgo(conv.updatedAt)}</span></Td>
    </tr>
  );
}

function ParticipantPill({ user }: { user?: { id: number; name?: string; email?: string; avatarUrl?: string | null } | null }) {
  if (!user) return <span className="text-[13px] text-[var(--text-tertiary)]">Unknown</span>;
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-tertiary)]/70 py-1 pl-1 pr-2">
      <UserAvatar name={user.name} src={user.avatarUrl} size="xs" />
      <span className="text-[12px] font-semibold text-[var(--text-secondary)]">{user.name}</span>
    </span>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''}`}>{children}</td>;
}
