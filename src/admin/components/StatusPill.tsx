import { prettyStatus, toneClasses, toneFor } from '../utils/status';

interface StatusPillProps {
  status?: string | null;
  /** Optional explicit tone (role, verified, read state). */
  tone?: 'green' | 'red' | 'amber' | 'blue' | 'slate' | 'violet' | 'teal' | 'rose';
  dot?: boolean;
}

export function StatusPill({ status, tone, dot = true }: StatusPillProps) {
  const resolved = tone ?? toneFor(status);
  const classes = toneClasses[resolved];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${classes.badge}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${classes.dot}`} />}
      {prettyStatus(status)}
    </span>
  );
}
