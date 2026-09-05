import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  input?: { label: string; value: string; onChange: (value: string) => void; placeholder?: string };
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = false,
  busy = false,
  onConfirm,
  onClose,
  input,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={busy ? undefined : onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 shadow-2xl"
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-100 text-red-600 dark:bg-red-500/10' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10'}`}>
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
                {description && <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>}
              </div>
            </div>
            {input && (
              <label className="mt-5 block">
                <span className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]">{input.label}</span>
                <textarea
                  value={input.value}
                  onChange={event => input.onChange(event.target.value)}
                  placeholder={input.placeholder}
                  maxLength={1000}
                  rows={3}
                  disabled={busy}
                  className="w-full resize-none rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50"
                />
              </label>
            )}
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={onClose}
                disabled={busy}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={busy}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-brand-600 hover:bg-brand-700'
                }`}
              >
                {busy && <Loader2 size={14} className="animate-spin" />}
                {busy ? 'Working…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
