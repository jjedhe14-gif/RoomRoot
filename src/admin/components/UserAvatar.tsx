interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md';
}

const SIZE_MAP = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
};

const COLORS = [
  'bg-brand-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-blue-500',
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

export function UserAvatar({ name, src, size = 'sm' }: UserAvatarProps) {
  const fallbackName = name || '?';
  const classes = SIZE_MAP[size];
  if (src) {
    return <img src={src} alt={fallbackName} className={`${classes} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <div className={`${classes} flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ${colorFor(fallbackName)}`}>
      {initialsOf(fallbackName)}
    </div>
  );
}
