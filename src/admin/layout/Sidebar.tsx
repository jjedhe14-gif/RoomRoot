import { ExternalLink, LogOut, Shield, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { adminNav } from '../nav';
import { useAdminUiStore } from '../store/adminUiStore';
import { UserAvatar } from '../components/UserAvatar';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:3000/';

export function Sidebar() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useAdminUiStore();
  const authUser = useAppStore(state => state.authUser);
  const logout = useAppStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <img src="/logo.svg" alt="RoomRoot" className="h-8 w-8 object-contain" />
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">RoomRoot</p>
              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-500">
                <Shield size={9} /> Admin Console
              </p>
            </div>
          </NavLink>
          <button
            className="rounded-lg p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Manage
          </p>
          {adminNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <item.icon size={16} strokeWidth={2} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile / logout */}
        <div className="border-t border-[var(--border-primary)] p-3">
          <div className="flex items-center gap-2.5 rounded-xl p-2">
            <UserAvatar name={authUser?.name} src={authUser?.avatarUrl} size="sm" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{authUser?.name || 'Administrator'}</p>
              <p className="truncate text-[11px] text-[var(--text-tertiary)]">{authUser?.email}</p>
            </div>
          </div>
          <a
            href={MAIN_SITE_URL}
            onClick={() => setSidebarOpen(false)}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <ExternalLink size={15} /> Main website
          </a>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
