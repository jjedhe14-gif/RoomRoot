import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Users, MessageSquare, User, Heart, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAppStore } from '../../stores/appStore';
import { GlassModal } from '../glass/GlassModal';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/roommates', label: 'Roommates', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
];

export function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const { isLoggedIn } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-6 z-50 glass-nav top-dock"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="RoomRoot" className="w-9 h-9 object-contain" />
              <span className="text-lg font-bold text-[var(--text-primary)] hidden sm:block">
                Room<span className="text-brand-600">Root</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-full"
                        layoutId="navbar-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link to="/saved" className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors relative">
                <Heart size={20} />
              </Link>
              <Link to="/notifications" className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to={isLoggedIn ? '/profile' : '/login'}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                <User size={16} />
                {isLoggedIn ? 'Profile' : 'Login'}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile sidebar */}
      <GlassModal isOpen={mobileOpen} onClose={() => setMobileOpen(false)} title="">
        <div className="flex flex-col gap-1">
          <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-tertiary)]">
            <X size={20} />
          </button>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
          <hr className="my-2 border-[var(--border-primary)]" />
          <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
            <Heart size={20} /> Saved
          </Link>
          <Link to="/notifications" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
            <Bell size={20} /> Notifications
          </Link>
          <Link to={isLoggedIn ? '/profile' : '/login'} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/20">
            <User size={20} /> {isLoggedIn ? 'Profile' : 'Login'}
          </Link>
        </div>
      </GlassModal>
    </>
  );
}
