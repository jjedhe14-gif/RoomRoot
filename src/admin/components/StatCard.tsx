import type { LucideIcon } from 'lucide-react';
import { formatNumber } from '../utils/format';

export type StatTone = 'brand' | 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'slate' | 'teal';

const ICON_TONES: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
};

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: StatTone;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, tone = 'brand', hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-secondary)]">{label}</p>
          <p className="mt-1.5 text-2xl sm:text-[28px] font-bold tracking-tight text-[var(--text-primary)]">
            {formatNumber(value)}
          </p>
          {hint && <p className="mt-1 truncate text-[11px] text-[var(--text-tertiary)]">{hint}</p>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ICON_TONES[tone]}`}>
          <Icon size={17} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
