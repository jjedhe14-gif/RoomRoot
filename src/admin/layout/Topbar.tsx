import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAdminUiStore } from '../store/adminUiStore';
import { UserAvatar } from '../components/UserAvatar';
import { useAppStore } from '../../stores/appStore';
import type { AdminNavItem } from '../nav';

interface TopbarProps {
  navItem?: AdminNavItem;
}

export function Topbar({ navItem }: TopbarProps) {
  const { setSidebarOpen, searchQuery, setSearchQuery } = useAdminUiStore();
  const { resolved, setTheme } = useThemeStore();
  const authUser = useAppStore(state => state.authUser);

  const toggleTheme = () => setTheme(resolved === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-bold tracking-tight text-[var(--text-primary)] sm:text-base">
            {navItem?.label ?? 'RoomRoot Admin'}
          </h1>
        </div>

        {navItem?.searchable && (
          <div className="relative hidden md:block">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search this view…"
              className="h-9 w-48 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] pl-8 pr-7 text-[13px] text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-tertiary)] focus:w-60 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 lg:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
          aria-label="Toggle color theme"
          title={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolved === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 ring-1 ring-[var(--border-primary)]">
          <UserAvatar name={authUser?.name} src={authUser?.avatarUrl} size="xs" />
          <span className="hidden max-w-[110px] truncate text-xs font-semibold text-[var(--text-secondary)] sm:block">
            {authUser?.name || 'Admin'}
          </span>
        </div>
      </div>

      {/* Mobile search */}
      {navItem?.searchable && (
        <div className="relative border-t border-[var(--border-primary)] px-4 py-2 md:hidden">
          <Search size={14} className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search this view…"
            className="h-9 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] pl-8 pr-8 text-[13px] text-[var(--text-primary)] outline-none focus:border-brand-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
