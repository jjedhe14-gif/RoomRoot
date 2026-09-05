// ==================== Status meta helpers ====================
// Maps backend status/action names to a consistent visual tone. All class
// strings below are static literals so Tailwind's JIT keeps them.

export type Tone =
  | 'green'
  | 'red'
  | 'amber'
  | 'blue'
  | 'slate'
  | 'violet'
  | 'teal'
  | 'rose';

export const toneClasses: Record<Tone, { badge: string; dot: string; text: string }> = {
  green: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  red: { badge: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  rose: { badge: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  amber: { badge: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  blue: { badge: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
  slate: { badge: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300', dot: 'bg-slate-400', text: 'text-slate-500 dark:text-slate-400' },
  violet: { badge: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300', dot: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
  teal: { badge: 'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-300', dot: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' },
};

const STATUS_TONE: Record<string, Tone> = {
  // User / account statuses
  ACTIVE: 'green',
  SUSPENDED: 'amber',
  DELETED: 'red',
  PENDING: 'amber',
  // Listing statuses
  PENDING_REVIEW: 'amber',
  REJECTED: 'red',
  INACTIVE: 'slate',
  // Application statuses
  ACCEPTED: 'green',
  WITHDRAWN: 'slate',
  // Report statuses
  REVIEWING: 'blue',
  RESOLVED: 'green',
  DISMISSED: 'slate',
  // Verification codes
  USED: 'green',
  EXPIRED: 'slate',
  // Roles
  ADMIN: 'violet',
  OWNER: 'blue',
  STUDENT: 'teal',
  // Read state
  UNREAD: 'blue',
  READ: 'slate',
};

export function toneFor(status?: string | null, fallback: Tone = 'slate'): Tone {
  if (!status) return fallback;
  const upper = status.toUpperCase();
  if (upper.startsWith('VERIFIED')) return 'green';
  if (upper === 'TRUE') return 'green';
  if (upper === 'FALSE') return 'amber';
  return STATUS_TONE[upper] ?? fallback;
}

export function roleTone(role?: string | null): Tone {
  return toneFor(role, 'slate');
}

/** Human friendly label for statuses stored in snake/upper case. */
export function prettyStatus(value?: string | null): string {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
