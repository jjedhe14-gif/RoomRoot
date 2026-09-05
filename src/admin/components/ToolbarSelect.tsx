import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface ToolbarSelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function ToolbarSelect({ label, value, options, onChange, className = '', ariaLabel }: ToolbarSelectProps) {
  return (
    <div className={className}>
      {label && <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</span>}
      <div className="relative">
        <select
          value={value}
          aria-label={ariaLabel}
          onChange={event => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] pl-3 pr-8 text-[13px] font-medium text-[var(--text-primary)] outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
      </div>
    </div>
  );
}

export const selectOptions = {
  all: { value: '', label: 'All' },
  roles: [
    { value: '', label: 'All roles' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'OWNER', label: 'Owner' },
    { value: 'ADMIN', label: 'Admin' },
  ],
  statuses: [
    { value: '', label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'DELETED', label: 'Deleted' },
  ],
  verified: [
    { value: '', label: 'Verification: all' },
    { value: 'true', label: 'Verified' },
    { value: 'false', label: 'Unverified' },
  ],
};
