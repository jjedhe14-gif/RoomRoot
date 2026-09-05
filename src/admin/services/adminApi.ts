// ==================== Admin API Client ====================
// Single, typed access layer for every admin dashboard request. Pages should
// never call fetch() directly - route through here so authentication and
// error handling stay centralized.

import { backendRequest, BackendApiError, clearBackendSession } from '../../services/backendApi';
import type {
  AdminApplication,
  AdminConversation,
  AdminListing,
  AdminNotificationEntry,
  AdminReport,
  AdminStats,
  AdminServiceRequest,
  AdminUser,
  AdminUserDetail,
  ApiPage,
  AuditLogEntry,
  SystemOverview,
  VerificationEntry,
  VerificationStatus,
} from '../types';
import { buildQuery } from '../utils/format';

export type ListingStatusParam = 'ACTIVE' | 'PENDING_REVIEW' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';
export type ApplicationStatusParam = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type ReportStatusParam = 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
export type ServiceRequestStatusParam = 'REQUESTED' | 'ASSIGNED' | 'ON_THE_WAY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

function handleSessionExpiry(cause: unknown): never {
  if (cause instanceof BackendApiError && cause.status === 401) {
    clearBackendSession();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.assign('/admin/login');
    }
  }
  throw cause;
}

/** Human readable message for an API failure (never a raw stack trace). */
export function adminErrorMessage(cause: unknown): string {
  if (cause instanceof BackendApiError) {
    if (cause.status === 401) return 'Your session has expired. Please sign in again.';
    if (cause.status === 403) return 'Access denied. An administrator role is required.';
    if (cause.status === 404) return 'The requested resource could not be found.';
    if (cause.status === 400) return cause.message || 'The request was invalid.';
    if (cause.status >= 500) return 'The backend encountered an error. Please try again.';
    return cause.message || 'Unable to complete the request.';
  }
  if (cause instanceof Error && cause.message) return cause.message;
  return 'Unable to reach the backend. Check that the server is running.';
}

// ---------------------------------------------------------------- queries

export interface UserFilters {
  role?: string;
  status?: string;
  emailVerified?: boolean;
  search?: string;
}

export const adminApi = {
  stats: () => adminGet<AdminStats>('/api/admin/stats'),

  systemOverview: () => adminGet<SystemOverview>('/api/admin/system'),

  // ---- Users ----
  users: (filters: UserFilters, page = 0, size = 20) => adminGetPage<AdminUser>(
    `/api/admin/users${buildQuery({ ...filters, page, size, sort: 'id,desc' })}`),
  userDetail: (id: number | string) => adminGet<AdminUserDetail>(`/api/admin/users/${id}`),
  updateUserStatus: (id: number | string, status: string, reason?: string) => adminPatch<AdminUser>(
    `/api/admin/users/${id}/status`, { status, reason }),

  // ---- Listings ----
  listings: (status: string | undefined, search: string | undefined, page = 0, size = 20) => adminGetPage<AdminListing>(
    `/api/admin/listings${buildQuery({ status, search, page, size, sort: 'createdAt,desc' })}`),
  updateListingStatus: (id: number | string, status: string) => adminPatch<AdminListing>(
    `/api/admin/listings/${id}/status`, { status }),
  deleteListing: (id: number | string) => adminDelete(`/api/admin/listings/${id}`),

  // ---- Applications ----
  applications: (status: string | undefined, search: string | undefined, page = 0, size = 20) => adminGetPage<AdminApplication>(
    `/api/admin/applications${buildQuery({ status, search, page, size, sort: 'createdAt,desc' })}`),

  // ---- Verification activity ----
  verifications: (email: string | undefined, status: VerificationStatus | undefined, page = 0, size = 20) => adminGetPage<VerificationEntry>(
    `/api/admin/verifications${buildQuery({ email, status, page, size, sort: 'createdAt,desc' })}`),

  // ---- Reports ----
  reports: (status: string | undefined, page = 0, size = 20) => adminGetPage<AdminReport>(
    `/api/admin/reports${buildQuery({ status, page, size, sort: 'createdAt,desc' })}`),
  reportById: (id: number | string) => adminGet<AdminReport>(`/api/admin/reports/${id}`),
  updateReportStatus: (id: number | string, status: string) => adminPatch<AdminReport>(
    `/api/admin/reports/${id}/status`, { status }),

  // ---- Conversations (metadata only) ----
  conversations: (page = 0, size = 20) => adminGetPage<AdminConversation>(
    `/api/admin/conversations${buildQuery({ page, size, sort: 'updatedAt,desc' })}`),

  // ---- Notifications ----
  notifications: (type: string | undefined, read: boolean | undefined, page = 0, size = 20) => adminGetPage<AdminNotificationEntry>(
    `/api/admin/notifications${buildQuery({ type, read, page, size, sort: 'createdAt,desc' })}`),

  serviceRequests: (status: string | undefined, page = 0, size = 20) => adminGetPage<AdminServiceRequest>(
    `/api/admin/service-requests${buildQuery({ status, page, size, sort: 'createdAt,desc' })}`),
  updateServiceRequestStatus: (id: number | string, status: ServiceRequestStatusParam) => adminPatch<AdminServiceRequest>(
    `/api/admin/service-requests/${id}/status?status=${status}`, {}),

  // ---- Activity / audit log ----
  activity: (
    filters: { action?: string; entityType?: string; search?: string; from?: string; to?: string },
    page = 0,
    size = 25,
  ) => adminGetPage<AuditLogEntry>(
    `/api/admin/activity${buildQuery({ ...filters, page, size, sort: 'createdAt,desc' })}`),
};

// ---------------------------------------------------------------- transport

async function adminGet<T>(path: string): Promise<T> {
  try {
    return await backendRequest<T>(path);
  } catch (cause) {
    return handleSessionExpiry(cause);
  }
}

async function adminGetPage<T>(path: string): Promise<ApiPage<T>> {
  try {
    return await backendRequest<ApiPage<T>>(path);
  } catch (cause) {
    return handleSessionExpiry(cause);
  }
}

async function adminPatch<T>(path: string, body: unknown): Promise<T> {
  try {
    return await backendRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  } catch (cause) {
    return handleSessionExpiry(cause);
  }
}

async function adminDelete(path: string): Promise<void> {
  try {
    await backendRequest<void>(path, { method: 'DELETE' });
  } catch (cause) {
    return handleSessionExpiry(cause);
  }
}
