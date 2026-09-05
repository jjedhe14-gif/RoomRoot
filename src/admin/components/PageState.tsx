import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Inbox, Loader2, RotateCw } from 'lucide-react';

export function LoadingState({ label = 'Loading data…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--text-tertiary)]">
      <Loader2 size={22} className="animate-spin text-brand-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function TableLoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="shimmer h-12 rounded-xl" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200/60 bg-red-50/60 px-6 py-12 text-center dark:border-red-500/20 dark:bg-red-500/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10">
        <AlertTriangle size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">Something went wrong</p>
        <p className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] ring-1 ring-[var(--border-primary)] transition hover:bg-[var(--bg-tertiary)]"
        >
          <RotateCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message }: { icon?: LucideIcon; title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        {message && <p className="mt-1 max-w-md text-[13px] text-[var(--text-tertiary)]">{message}</p>}
      </div>
    </div>
  );
}
