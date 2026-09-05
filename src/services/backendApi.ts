export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export class BackendApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'BackendApiError';
    this.status = status;
    this.code = code;
  }
}

export async function backendRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('roomroot-token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null) as ApiEnvelope<T> | T | null;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body ? body.message : undefined;
    const code = body && typeof body === 'object' && 'error' in body ? body.error : undefined;
    const fallback = response.status === 401
      ? 'Your session has expired. Please sign in again.'
      : response.status === 403
        ? 'You do not have permission to perform this action.'
        : 'Unable to complete the request. Please try again.';
    throw new BackendApiError(String(message || fallback), response.status, typeof code === 'string' ? code : undefined);
  }

  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    if (!body.success) throw new BackendApiError(body.message || 'Unable to complete the request.', response.status, body.error);
    return body.data;
  }
  return body as T;
}

export function clearBackendSession() {
  localStorage.removeItem('roomroot-token');
  localStorage.removeItem('roomroot-user');
}
