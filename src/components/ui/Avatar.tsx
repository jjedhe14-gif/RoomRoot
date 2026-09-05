import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

export function Avatar({ name, src, size = 'md', online, className = '' }: AvatarProps) {
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white ${getAvatarColor(name)}`}>
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[var(--bg-primary)] ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
    </div>
  );
}
