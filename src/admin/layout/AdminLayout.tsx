import { Outlet, useLocation } from 'react-router-dom';
import { activeNavItem } from '../nav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayout() {
  const location = useLocation();
  const navItem = activeNavItem(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <Topbar navItem={navItem} />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <footer className="border-t border-[var(--border-primary)] px-6 py-4 text-center text-[11px] text-[var(--text-tertiary)]">
          RoomRoot Admin Console · Internal use only
        </footer>
      </div>
    </div>
  );
}
