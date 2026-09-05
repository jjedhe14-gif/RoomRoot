import { useState } from 'react';
import { RefreshCw, Wrench } from 'lucide-react';
import { adminApi, adminErrorMessage, type ServiceRequestStatusParam } from '../services/adminApi';
import type { AdminServiceRequest, ApiPage } from '../types';
import { useAdminResource } from '../hooks/useAdminResource';
import { EmptyState, LoadingState } from '../components/PageState';
import { StatusPill } from '../components/StatusPill';
import { useToastStore } from '../../stores/toastStore';

const statuses: ServiceRequestStatusParam[] = ['REQUESTED', 'ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
function pageOf(data: ApiPage<AdminServiceRequest>): ApiPage<AdminServiceRequest> { return data; }

export default function ServiceRequests() {
  const [status, setStatus] = useState('');
  const { addToast } = useToastStore();
  const resource = useAdminResource(() => adminApi.serviceRequests(status || undefined), [status], 15000);
  const page = resource.data ? pageOf(resource.data) : null;

  const update = async (request: AdminServiceRequest, next: ServiceRequestStatusParam) => {
    try {
      await adminApi.updateServiceRequestStatus(request.id, next);
      addToast(`Service request #${request.id} updated.`, 'success');
      resource.reload();
    } catch (cause) { addToast(adminErrorMessage(cause), 'error'); }
  };

  if (resource.loading && !page) return <LoadingState label="Loading service requests…" />;
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-bold text-[var(--text-primary)]">Service Requests</h1><p className="mt-1 text-sm text-[var(--text-secondary)]">Live maintenance requests from RoomRoot users.</p></div>
      <div className="flex items-center gap-2">
        <select value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]"><option value="">All statuses</option>{statuses.map(value => <option key={value} value={value}>{value.replace(/_/g, ' ')}</option>)}</select>
        <button onClick={() => resource.reload()} className="rounded-xl border border-[var(--border-primary)] p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]" title="Refresh"><RefreshCw size={16} /></button>
      </div>
    </div>
    {!page || page.content.length === 0 ? <EmptyState icon={Wrench} title="No service requests" message="User service requests will appear here as soon as they are submitted." /> : <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]"><div className="divide-y divide-[var(--border-primary)]">{page.content.map(request => <div key={request.id} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)]">#{request.id} · {request.serviceType}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">{request.user?.name} · {request.user?.email}</p></div><StatusPill status={request.status} /></div>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{request.description || 'No description provided.'}</p><p className="mt-2 text-xs text-[var(--text-tertiary)]">{request.address}{request.preferredDate ? ` · ${request.preferredDate}` : ''}{request.preferredTime ? ` at ${request.preferredTime}` : ''}</p>
      <div className="mt-3 flex flex-wrap gap-2">{statuses.filter(value => value !== request.status).map(value => <button key={value} onClick={() => void update(request, value)} className="rounded-lg border border-[var(--border-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Mark {value.replace(/_/g, ' ').toLowerCase()}</button>)}</div>
    </div>)}</div></div>}
  </div>;
}
