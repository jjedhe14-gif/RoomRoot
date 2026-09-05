import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Ban, CheckCircle2, Eye, Home, Trash2, X, XCircle } from 'lucide-react';
import { adminApi, adminErrorMessage } from '../services/adminApi';
import type { AdminListing } from '../types';
import { formatMoney, formatDateTime, normalizePage } from '../utils/format';
import { useAdminResource } from '../hooks/useAdminResource';
import { useDebounced } from '../hooks/useDebounced';
import { useAdminUiStore } from '../store/adminUiStore';
import { useToastStore } from '../../stores/toastStore';
import { StatusPill } from '../components/StatusPill';
import { ToolbarSelect } from '../components/ToolbarSelect';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState, ErrorState, TableLoadingState } from '../components/PageState';
import { UserAvatar } from '../components/UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_SIZE = 20;

type StatusAction = 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
type ConfirmTarget =
  | { type: 'status'; listing: AdminListing; action: StatusAction }
  | { type: 'delete'; listing: AdminListing }
  | null;

export default function Listings() {
  const { addToast } = useToastStore();
  const searchQuery = useAdminUiStore(state => state.searchQuery);
  const debouncedSearch = useDebounced(searchQuery, 350);

  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState<ConfirmTarget>(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<AdminListing | null>(null);

  const load = useCallback(
    () => adminApi.listings(status || undefined, debouncedSearch || undefined, page, PAGE_SIZE),
    [status, debouncedSearch, page],
  );
  const { data, loading, error, reload } = useAdminResource(load, [status, debouncedSearch, page]);
  const flat = useMemo(() => (data ? normalizePage(data) : null), [data]);

  const runConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.type === 'delete') {
        await adminApi.deleteListing(confirm.listing.id);
        addToast(`Listing "${confirm.listing.title}" deleted permanently.`, 'success');
        if (selected?.id === confirm.listing.id) setSelected(null);
      } else {
        await adminApi.updateListingStatus(confirm.listing.id, confirm.action);
        addToast(`Listing "${confirm.listing.title}" ${statusVerb(confirm.action)}.`, 'success');
        if (selected?.id === confirm.listing.id) setSelected(null);
      }
      setConfirm(null);
      reload();
    } catch (cause) {
      addToast(adminErrorMessage(cause), 'error');
    } finally {
      setBusy(false);
    }
  };

  const actionFromStatus = (listing: AdminListing): StatusAction | null => {
    if (listing.status === 'PENDING_REVIEW' || listing.status === 'REJECTED' || listing.status === 'SUSPENDED') return 'ACTIVE';
    return null;
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
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PENDING_REVIEW', label: 'Pending review' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'SUSPENDED', label: 'Suspended' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
            onChange={value => { setStatus(value); setPage(0); }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {flat ? `${flat.totalElements.toLocaleString()} listing${flat.totalElements === 1 ? '' : 's'}` : 'Loading listings…'}
        </p>
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm">
          {loading && !data ? (
            <TableLoadingState />
          ) : !flat || flat.content.length === 0 ? (
            <EmptyState icon={Home} title="No listings found" message="Try a different status filter or search term." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <Th>ID</Th>
                      <Th>Listing</Th>
                      <Th>Owner</Th>
                      <Th>Location</Th>
                      <Th>Rent</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {flat.content.map(listing => (
                      <ListingRow
                        key={listing.id}
                        listing={listing}
                        onView={() => setSelected(listing)}
                        onApprove={actionFromStatus(listing) ? () => setConfirm({ type: 'status', listing, action: 'ACTIVE' }) : undefined}
                        onReject={listing.status === 'ACTIVE' || listing.status === 'PENDING_REVIEW' ? () => setConfirm({ type: 'status', listing, action: 'REJECTED' }) : undefined}
                        onSuspend={listing.status === 'ACTIVE' || listing.status === 'PENDING_REVIEW' ? () => setConfirm({ type: 'status', listing, action: 'SUSPENDED' }) : undefined}
                        onDelete={() => setConfirm({ type: 'delete', listing })}
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

      {/* Details drawer */}
      <ListingDetails listing={selected} onClose={() => setSelected(null)} />

      {/* Confirmation */}
      <ConfirmDialog
        open={confirm !== null}
        title={confirmTitle(confirm)}
        description={confirmDescription(confirm)}
        confirmLabel={confirm?.type === 'delete' ? 'Delete listing' : confirm?.type === 'status' ? statusVerb(confirm.action) : 'Confirm'}
        danger={confirm?.type === 'delete' || confirm?.action === 'REJECTED' || confirm?.action === 'SUSPENDED'}
        busy={busy}
        onConfirm={() => void runConfirm()}
        onClose={() => { if (!busy) setConfirm(null); }}
      />
    </div>
  );
}

function statusVerb(action: StatusAction): string {
  switch (action) {
    case 'ACTIVE': return 'approved (set active)';
    case 'REJECTED': return 'rejected';
    case 'SUSPENDED': return 'suspended';
  }
}

function confirmTitle(confirm: ConfirmTarget): string {
  if (!confirm) return '';
  if (confirm.type === 'delete') return 'Delete this listing?';
  switch (confirm.action) {
    case 'ACTIVE': return 'Approve this listing?';
    case 'REJECTED': return 'Reject this listing?';
    case 'SUSPENDED': return 'Suspend this listing?';
  }
}

function confirmDescription(confirm: ConfirmTarget): string | undefined {
  if (!confirm) return undefined;
  const name = `"${confirm.listing.title}" (#${confirm.listing.id})`;
  if (confirm.type === 'delete') {
    return `This permanently deletes ${name}. This cannot be undone.`;
  }
  switch (confirm.action) {
    case 'ACTIVE': return `${name} will be published and visible to students again.`;
    case 'REJECTED': return `${name} will be marked rejected and hidden from public search.`;
    case 'SUSPENDED': return `${name} will be hidden from the platform until an administrator reinstates it.`;
  }
}

function ListingRow(props: { listing: AdminListing; onView: () => void; onApprove?: () => void; onReject?: () => void; onSuspend?: () => void; onDelete: () => void }) {
  const { listing, onView, onApprove, onReject, onSuspend, onDelete } = props;
  const cover = listing.images?.[0];
  return (
    <tr onClick={onView} className="cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]/50">
      <Td mono>#{listing.id}</Td>
      <Td>
        <div className="flex items-center gap-2.5">
          {cover ? (
            <img src={cover} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" loading="lazy" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10"><Home size={15} /></div>
          )}
          <div className="min-w-0 max-w-[240px]">
            <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{listing.title}</p>
            <p className="truncate text-[11px] text-[var(--text-tertiary)]">{listing.address || 'No address'}</p>
          </div>
        </div>
      </Td>
      <Td>
        <div className="flex items-center gap-2">
          <UserAvatar name={listing.owner?.name} src={listing.owner?.avatarUrl} size="xs" />
          <span className="max-w-[130px] truncate text-[13px] text-[var(--text-secondary)]">{listing.owner?.name || '—'}</span>
        </div>
      </Td>
      <Td>
        <span className="text-[13px] text-[var(--text-secondary)]">
          {[listing.city, listing.locality].filter(Boolean).join(' · ') || '—'}
        </span>
      </Td>
      <Td><span className="text-[13px] font-semibold tabular-nums text-[var(--text-primary)]">{formatMoney(listing.monthlyRent)}</span></Td>
      <Td><StatusPill status={listing.status} /></Td>
      <Td><span className="text-[13px] text-[var(--text-secondary)]">{formatDateTime(listing.createdAt)}</span></Td>
      <Td>
        <div className="flex justify-end gap-1" onClick={event => event.stopPropagation()}>
          <IconAction title="View details" onClick={onView}><Eye size={14} /></IconAction>
          {onApprove && <IconAction title="Approve / activate" tone="green" onClick={onApprove}><CheckCircle2 size={14} /></IconAction>}
          {onReject && <IconAction title="Reject" tone="red" onClick={onReject}><XCircle size={14} /></IconAction>}
          {onSuspend && <IconAction title="Suspend" tone="amber" onClick={onSuspend}><Ban size={14} /></IconAction>}
          <IconAction title="Delete permanently" tone="red" onClick={onDelete}><Trash2 size={14} /></IconAction>
        </div>
      </Td>
    </tr>
  );
}

function IconAction({ children, onClick, title, tone = 'slate' }: { children: ReactNode; onClick: () => void; title: string; tone?: 'green' | 'red' | 'amber' | 'slate' }) {
  const tones = {
    green: 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10',
    red: 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10',
    amber: 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10',
    slate: 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
  };
  return (
    <button title={title} onClick={onClick} className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition ${tones[tone]}`}>
      {children}
    </button>
  );
}

function ListingDetails({ listing, onClose }: { listing: AdminListing | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {listing && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Listing #{listing.id}</p>
                <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)]">{listing.title}</h3>
                <div className="mt-2 flex items-center gap-2"><StatusPill status={listing.status} /></div>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]" aria-label="Close details">
                <X size={18} />
              </button>
            </div>

            {listing.images && listing.images.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {listing.images.slice(0, 6).map((image, index) => (
                  <img key={index} src={image} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" loading="lazy" />
                ))}
              </div>
            )}

            <dl className="space-y-3 text-[13px]">
              <InfoRow label="Monthly rent"><strong>{formatMoney(listing.monthlyRent)}</strong></InfoRow>
              <InfoRow label="Deposit">{formatMoney(listing.securityDeposit)}</InfoRow>
              <InfoRow label="Location">{[listing.address, listing.city, listing.locality].filter(Boolean).join(', ')}</InfoRow>
              <InfoRow label="Room type">{listing.roomType?.replace('_', ' ') || '—'}</InfoRow>
              <InfoRow label="Furnishing">{listing.furnished?.replace('_', ' ') || '—'}</InfoRow>
              <InfoRow label="Gender preference">{listing.genderPreference || '—'}</InfoRow>
              <InfoRow label="Availability">{listing.available ? `Open (${listing.availableRooms ?? 0} of ${listing.totalRooms ?? 0} rooms)` : 'Unavailable'}</InfoRow>
              <InfoRow label="Owner">
                {listing.owner ? `${listing.owner.name} (${listing.owner.email})` : '—'}
              </InfoRow>
              <InfoRow label="Created">{formatDateTime(listing.createdAt)}</InfoRow>
              <InfoRow label="Last updated">{formatDateTime(listing.updatedAt)}</InfoRow>
              {listing.description && (
                <div className="border-t border-[var(--border-primary)] pt-3">
                  <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Description</dt>
                  <dd className="whitespace-pre-line leading-relaxed text-[var(--text-secondary)]">{listing.description}</dd>
                </div>
              )}
            </dl>
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
