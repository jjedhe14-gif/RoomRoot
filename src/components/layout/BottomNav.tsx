import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Users, MessageSquare, User } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/roommates', label: 'Roommates', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dockRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDown = useRef(false);
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const startX = useRef(0);
  const originIndex = useRef(0);
  const currentIndex = useRef(0);
  const pointerId = useRef<number | null>(null);
  const [ringX, setRingX] = useState(0);
  const [ringVisible, setRingVisible] = useState(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const getTabIndex = useCallback((clientX: number) => {
    const dock = dockRef.current;
    if (!dock) return 0;
    const rect = dock.getBoundingClientRect();
    const index = Math.floor(((clientX - rect.left) / rect.width) * tabs.length);
    return Math.max(0, Math.min(tabs.length - 1, index));
  }, []);

  const getTabCenter = useCallback((index: number) => {
    const dock = dockRef.current;
    if (!dock) return 0;
    const rect = dock.getBoundingClientRect();
    return ((index + 0.5) / tabs.length) * rect.width;
  }, []);

  const resetGesture = useCallback(() => {
    pointerDown.current = false;
    dragging.current = false;
    pointerId.current = null;
    clearLongPress();
    setRingVisible(false);
  }, [clearLongPress]);

  useEffect(() => resetGesture(), [location.pathname, resetGesture]);
  useEffect(() => () => resetGesture(), [resetGesture]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || pointerDown.current) return;
    const index = getTabIndex(event.clientX);
    pointerDown.current = true;
    pointerId.current = event.pointerId;
    startX.current = event.clientX;
    originIndex.current = index;
    currentIndex.current = index;
    suppressClick.current = false;
    setRingX(getTabCenter(index));
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      if (pointerDown.current && !dragging.current) setRingVisible(true);
    }, 220);
  }, [clearLongPress, getTabCenter, getTabIndex]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDown.current || event.pointerId !== pointerId.current) return;
    if (!dragging.current && Math.abs(event.clientX - startX.current) > 8) {
      dragging.current = true;
      suppressClick.current = true;
      clearLongPress();
      setRingVisible(true);
    }
    if (!dragging.current) return;
    const index = getTabIndex(event.clientX);
    currentIndex.current = index;
    setRingX(getTabCenter(index));
  }, [clearLongPress, getTabCenter, getTabIndex]);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDown.current || event.pointerId !== pointerId.current) return;
    if (dragging.current) {
      const targetIndex = currentIndex.current;
      if (targetIndex !== originIndex.current) navigate(tabs[targetIndex].to);
    }
    resetGesture();
  }, [navigate, resetGesture]);

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }, []);

  return (
    <nav className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 z-50 md:hidden">
      <div
        ref={dockRef}
        className="glass-nav bottom-dock border-t border-[var(--glass-border)] relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetGesture}
        onClickCapture={handleClickCapture}
        style={{ touchAction: 'none' }}
      >
        <div className="flex items-center h-16 px-2 relative">
          {ringVisible && (
            <motion.div
              className="absolute pointer-events-none z-10 flex items-center justify-center gap-1.5 rounded-full border border-white/50 bg-white/10 text-[11px] font-bold text-[var(--text-primary)] shadow-[0_0_24px_rgba(66,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[18px] saturate-150"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ left: ringX, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{ top: '50%', left: ringX, width: 64, height: 48, marginTop: -24, marginLeft: -32 }}
            >
            </motion.div>
          )}
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = location.pathname === tab.to;
          return (
            <button
              type="button"
              key={tab.to}
              onClick={() => navigate(tab.to)}
              aria-label={`${tab.label}. Long press and drag to navigate.`}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition-colors select-none ${
                active ? 'text-brand-600' : 'text-[var(--text-tertiary)]'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <motion.div
                  className="absolute -bottom-0.5 w-5 h-0.5 bg-brand-600 rounded-full"
                  layoutId="bottomnav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
