import { create } from 'zustand';
import type { FilterState, Conversation, Message } from '../types';
import { conversations as mockConversations } from '../data/mockData';
import { clearBackendSession } from '../services/backendApi';
import type { BackendUser } from '../services/authService';
import { saveProfileToStorage } from '../services/authService';

// ==================== APP STORE ====================
interface AppState {
  // Saved rooms
  savedRooms: string[];
  toggleSaveRoom: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  activeFilterCount: () => number;

  // Location
  userLocation: { lat: number; lng: number } | null;
  locationLoading: boolean;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setLocationLoading: (loading: boolean) => void;

  // Auth
  isLoggedIn: boolean;
  login: () => void;
  authUser: BackendUser | null;
  setSession: (token: string, user: BackendUser) => void;
  isAdmin: () => boolean;
  updateProfile: (updates: Partial<BackendUser>) => void;
  logout: () => void;

  // Chat
  conversations: Conversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;

  // Compare
  compareList: string[];
  toggleCompare: (id: string) => void;

  // Modals
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const defaultFilters: FilterState = {
  budget: [0, 50000],
  gender: [],
  roomType: [],
  amenities: [],
  ac: null,
  foodIncluded: null,
  furnished: [],
  searchQuery: '',
};

function getStoredAuthUser(): BackendUser | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('roomroot-user') || 'null') as BackendUser | null;
  } catch {
    return null;
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  savedRooms: ['p1', 'p5', 'p19'],
  toggleSaveRoom: (id) => set(state => ({
    savedRooms: state.savedRooms.includes(id)
      ? state.savedRooms.filter(r => r !== id)
      : [...state.savedRooms, id]
  })),
  isSaved: (id) => get().savedRooms.includes(id),

  filters: { ...defaultFilters },
  setFilters: (f) => set(state => ({ filters: { ...state.filters, ...f } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  activeFilterCount: () => {
    const f = get().filters;
    let count = 0;
    if (f.budget[0] > 0 || f.budget[1] < 50000) count++;
    count += f.gender.length;
    count += f.roomType.length;
    count += f.amenities.length;
    if (f.ac !== null) count++;
    if (f.foodIncluded !== null) count++;
    count += f.furnished.length;
    return count;
  },

  userLocation: null,
  locationLoading: false,
  setUserLocation: (loc) => set({ userLocation: loc }),
  setLocationLoading: (loading) => set({ locationLoading: loading }),

  isLoggedIn: typeof window !== 'undefined' && Boolean(localStorage.getItem('roomroot-token')),
  login: () => set({ isLoggedIn: true }),
  authUser: getStoredAuthUser(),
  setSession: (token, user) => {
    localStorage.setItem('roomroot-token', token);
    localStorage.setItem('roomroot-user', JSON.stringify(user));
    set({ isLoggedIn: true, authUser: user });
  },
  isAdmin: () => get().authUser?.role?.toUpperCase() === 'ADMIN',
  updateProfile: (updates) => set(state => {
    if (!state.authUser) return state;
    const updated = { ...state.authUser, ...updates };
    localStorage.setItem('roomroot-user', JSON.stringify(updated));
    if (updated.email) saveProfileToStorage(updated.email, updates);
    return { authUser: updated };
  }),
  logout: () => {
    clearBackendSession();
    set({ isLoggedIn: false, authUser: null });
  },

  conversations: mockConversations,
  activeConversation: null,
  setActiveConversation: (id) => set({ activeConversation: id }),
  sendMessage: (conversationId, text) => set(state => ({
    conversations: state.conversations.map(c =>
      c.id === conversationId
        ? {
            ...c,
            messages: [...c.messages, {
              id: `msg-${Date.now()}`,
              senderId: 'current',
              text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: true,
            }],
            lastMessage: text,
            lastTime: 'Just now',
          }
        : c
    )
  })),

  compareList: [],
  toggleCompare: (id) => set(state => ({
    compareList: state.compareList.includes(id)
      ? state.compareList.filter(c => c !== id)
      : state.compareList.length < 3 ? [...state.compareList, id] : state.compareList
  })),

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
