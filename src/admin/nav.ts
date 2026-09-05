import {
  Bell,
  ClipboardList,
  Flag,
  History,
  Home,
  LayoutDashboard,
  MessagesSquare,
  Server,
  ShieldCheck,
  Wrench,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  /** Pages that accept the topbar search query. */
  searchable?: boolean;
}

export const adminNav: AdminNavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users, searchable: true },
  { to: '/admin/listings', label: 'Listings', icon: Home, searchable: true },
  { to: '/admin/applications', label: 'Applications', icon: ClipboardList, searchable: true },
  { to: '/admin/otp', label: 'OTP & Verification', shortLabel: 'OTP & Verification', icon: ShieldCheck, searchable: true },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/conversations', label: 'Conversations', icon: MessagesSquare },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell, searchable: true },
  { to: '/admin/service-requests', label: 'Service Requests', icon: Wrench, searchable: true },
  { to: '/admin/activity', label: 'Activity Logs', shortLabel: 'Activity Logs', icon: History, searchable: true },
  { to: '/admin/system', label: 'System Overview', icon: Server },
];

export function activeNavItem(pathname: string): AdminNavItem | undefined {
  const exact = adminNav.find(item => item.to === pathname);
  if (exact) return exact;
  return adminNav.find(item => pathname.startsWith(`${item.to}/`));
}
