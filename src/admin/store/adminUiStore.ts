import { create } from 'zustand';

interface AdminUiState {
  /** Mobile drawer visibility. */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Topbar search term consumed by list pages. */
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useAdminUiStore = create<AdminUiState>(set => ({
  sidebarOpen: false,
  setSidebarOpen: open => set({ sidebarOpen: open }),
  searchQuery: '',
  setSearchQuery: query => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),
}));
