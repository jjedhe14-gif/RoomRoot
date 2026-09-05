export function formatPrice(price: number): string {
  if (price >= 1000) {
    const k = price / 1000;
    return k === Math.floor(k) ? `₹${k}k` : `₹${(price / 1000).toFixed(1)}k`;
  }
  return `₹${price}`;
}

export function formatPriceFull(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function getStarRating(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export function getGenderIcon(gender: string): string {
  switch (gender) {
    case 'boys': return '👨';
    case 'girls': return '👩';
    default: return '👥';
  }
}

export function getRoomTypeLabel(type: string): string {
  switch (type) {
    case 'single': return 'Single';
    case 'double': return '2-Sharing';
    case 'triple': return '3-Sharing';
    case 'quad': return '4+ Sharing';
    default: return type;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-green-500';
    case 'in-progress': return 'text-blue-500';
    case 'assigned': return 'text-yellow-500';
    case 'on-the-way': return 'text-orange-500';
    default: return 'text-gray-500';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'requested': return 'Requested';
    case 'assigned': return 'Assigned';
    case 'on-the-way': return 'On The Way';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-brand-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-emerald-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
