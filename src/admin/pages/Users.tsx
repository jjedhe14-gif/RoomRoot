import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, MailX, ShieldCheck, Users as UsersIcon, UserX } from 'lucide-react';
import { adminApi, adminErrorMessage } from '../services/adminApi';
import type { AdminUser } from '../types';
import { normalizePage, timeAgo, titleCase } from '../utils/format';
import { toneFor, toneClasses } from '../utils/status';
import { roleTone } from '../utils/status';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { useToastStore } from '../../stores/toastStore';
import { StatusPill } from '../components/StatusPill';
import { UserAvatar } from '../components/UserAvatar';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState, EmptyState, TableLoadingState } from '../components/PageState';

const PAGE_SIZE = 20;

type ConfirmTarget = { user: AdminUser; action: 'ACTIVE' | 'SUSPENDED' } | null;

export default function Users() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);

  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState('');
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState<ConfirmTarget>(null);
  const [busyAction, setBusyAction] = useState(false);

  const load = useCallback(
    () => adminApi.users(
      { role: role || undefined, status: status || undefined, emailVerified: verified === 'true' ? true : verified === 'false' ? false : undefined, search: debouncedSearch || undefined },
      page,
      PAGE_SIZE,
    ),
    [role, status, verified, debouncedSearch, page],
  );

  const { data, loading, error, reload } = useAdminResource(load, [role, status, verified, debouncedSearch, page]);

  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(0);
  };

  const runStatusChange = async () => {
    if (!confirm) return;
    setBusyAction(true);
    try {
      await adminApi.updateUserStatus(confirm.user.id, confirm.action);
      addToast(confirm.action === 'SUSPENDED' ? `${confirm.user.name} has been suspended.` : `${confirm.user.name} has been activated.`, 'success');
      setConfirm(null);
      reload();
    } catch (cause) {
      addToast(adminErrorMessage(cause), 'error');
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2.5">
          <ToolbarSelect label="Role" value={role} options={selectRoles} onChange={changeFilter(setRole)} />
          <ToolbarSelect label="Status" value={status} options={selectStatuses} onChange={changeFilter(setStatus)} />
          <ToolbarSelect label="Email" value={verified} options={selectVerified} onChange={changeFilter(setVerified)} />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? <>{flat.totalElements.toLocaleString()} user{flat.totalElements === 1 ? '' : 's'}</> : 'Loading users…'}
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
              icon={UsersIcon}
              title="No users found"
              message="Try adjusting the filters or clearing the search term."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>User</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                      <Th>Email</Th>
                      <Th>University</Th>
                      <Th>Budget</Th>
                      <Th>Joined</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(user => <UserRow key={user.id} user={user} onOpen={() => navigate(`/admin/users/${user.id}`)} onAction={setConfirm} />)}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                totalPages={flat.totalPages}
                totalElements={flat.totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.action === 'SUSPENDED' ? `Suspend ${confirm?.user.name}?` : `Activate ${confirm?.user.name}?`}
        description={
          confirm?.action === 'SUSPENDED'
            ? 'A suspended user cannot sign in or use RoomRoot until an administrator reactivates them.'
            : 'This will restore full access for the account.'
        }
        confirmLabel={confirm?.action === 'SUSPENDED' ? 'Suspend account' : 'Activate account'}
        danger={confirm?.action === 'SUSPENDED'}
        busy={busyAction}
        onConfirm={() => void runStatusChange()}
        onClose={() => { if (!busyAction) setConfirm(null); }}
      />
    </div>
  );
}

function UserRow({ user, onOpen, onAction }: { user: AdminUser; onOpen: () => void; onAction: (target: { user: AdminUser; action: 'ACTIVE' | 'SUSPENDED' }) => void }) {
  const roleToneClass = toneClasses[roleTone(user.role)];
  const budget = user.budget != null ? `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(user.budget)}` : '—';

  return (
    <tr onClick={onOpen} className="cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]/50">
      <Td mono>#{user.id}</Td>
      <Td>
        <div className="flex items-center gap-2.5">
          <UserAvatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-[var(--text-primary)]">
              {user.name}
              {user.emailVerified ? (
                <BadgeCheck size={13} className="shrink-0 text-emerald-500" aria-label="Email verified" />
              ) : (
                <MailX size={13} className="shrink-0 text-amber-500" aria-label="Email not verified" />
              )}
            </p>
            <p className="truncate text-[11px] text-[var(--text-tertiary)]">{user.email}</p>
          </div>
        </div>
      </Td>
      <Td>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${roleToneClass.badge}`}>
          {user.role === 'ADMIN' && <ShieldCheck size={11} />}
          {titleCase(user.role)}
        </span>
      </Td>
      <Td><StatusPill status={user.status} /></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]">{user.email}</span></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]">{user.university || '—'}</span></Td>
      <Td><span className="text-[13px] tabular-nums text-[var(--text-secondary)]">{budget}</span></Td>
      <Td>
        <div className="text-[13px] text-[var(--text-secondary)]">{user.createdAt ? timeAgo(user.createdAt) : '—'}</div>
      </Td>
      <Td>
        <div className="flex justify-end gap-1.5" onClick={event => event.stopPropagation()}>
          {user.status === 'ACTIVE' ? (
            <RowButton danger onClick={() => onAction({ user, action: 'SUSPENDED' })}>
              <UserX size={12} /> Suspend
            </RowButton>
          ) : (
            <RowButton onClick={() => onAction({ user, action: 'ACTIVE' })}>
              <ShieldCheck size={12} /> Activate
            </RowButton>
          )}
        </div>
      </Td>
    </tr>
  );
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-2.5 ${className}`}>{children}</th>;
}

function Td({ children, mono = false, className = '' }: { children: ReactNode; mono?: boolean; className?: string }) {
  return (
    <td className={`whitespace-nowrap px-4 py-3 ${mono ? 'font-mono text-[12px] text-[var(--text-tertiary)]' : ''} ${className}`}>
      {children}
    </td>
  );
}

function RowButton({ children, onClick, danger = false }: { children: ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
        danger
          ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10'
          : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
      }`}
    >
      {children}
    </button>
  );
}

const selectRoles = [
  { value: '', label: 'All roles' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'OWNER', label: 'Owners' },
  { value: 'ADMIN', label: 'Admins' },
];

const selectStatuses = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DELETED', label: 'Deleted' },
];

const selectVerified = [
  { value: '', label: 'Verification: all' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Unverified' },
];
