// ==================== Admin Formatting Helpers ====================

export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDateTime(value?: string | null): string {
  const date = parseDate(value);
  return date ? dateTimeFormatter.format(date) : '—';
}

export function formatDate(value?: string | null): string {
  const date = parseDate(value);
  return date ? dateFormatter.format(date) : '—';
}

export function formatTime(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return '—';
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function timeAgo(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return '—';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 0) return 'just now';
  if (seconds < 45) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return dateFormatter.format(date);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat().format(value);
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
}

export function titleCase(value?: string | null): string {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function initials(name?: string | null): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

export function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

/** Normalize either serialization shape of a Spring Data page into a flat page. */
export interface FlatPage<T> {
  content: T[];
  number: number; // 0-indexed
  size: number;
  totalElements: number;
  totalPages: number;
}

export function normalizePage<T>(page: ApiPageLike<T>): FlatPage<T> {
  const content = page.content ?? [];
  const meta = page.page;
  const number = meta?.number ?? page.number ?? 0;
  const size = meta?.size ?? page.size ?? content.length;
  const totalElements = meta?.totalElements ?? page.totalElements ?? content.length;
  const totalPages = meta?.totalPages ?? page.totalPages ?? Math.max(1, Math.ceil(totalElements / Math.max(1, size)));
  return { content, number, size, totalElements, totalPages };
}

// Minimal structural typing to avoid a circular import with types.ts
interface ApiPageLike<T> {
  content?: T[];
  page?: { size?: number; number?: number; totalElements?: number; totalPages?: number };
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}
