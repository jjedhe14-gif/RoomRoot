import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

const saved = (typeof window !== 'undefined' ? localStorage.getItem('roomroot-theme') : null) as Theme | null;
const initialResolved = saved === 'system' || !saved ? getSystemTheme() : saved === 'dark' ? 'dark' : 'light';
if (typeof window !== 'undefined') applyTheme(initialResolved);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: saved || 'system',
  resolved: initialResolved,
  setTheme: (theme) => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(resolved);
    localStorage.setItem('roomroot-theme', theme);
    set({ theme, resolved });
  },
}));

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const store = useThemeStore.getState();
    if (store.theme === 'system') {
      const resolved = getSystemTheme();
      applyTheme(resolved);
      useThemeStore.setState({ resolved });
    }
  });
}
