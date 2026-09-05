import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface PaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }: PaginationProps) {
  if (totalElements === 0) return null;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);
  const canPrevious = page > 0;
  const canNext = page + 1 < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border-primary)] px-4 py-3 sm:flex-row">
      <p className="text-xs text-[var(--text-tertiary)]">
        Showing <span className="font-semibold text-[var(--text-secondary)]">{formatNumber(from)}–{formatNumber(to)}</span> of{' '}
        <span className="font-semibold text-[var(--text-secondary)]">{formatNumber(totalElements)}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          disabled={!canPrevious}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] ring-1 ring-[var(--border-primary)] transition enabled:hover:bg-[var(--bg-tertiary)] disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="px-2 text-xs font-medium text-[var(--text-secondary)]">
          Page {page + 1} of {Math.max(1, totalPages)}
        </span>
        <button
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] ring-1 ring-[var(--border-primary)] transition enabled:hover:bg-[var(--bg-tertiary)] disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
