import type { Property, Roommate, Maid, Service, Conversation, Notification, User, FilterState } from '../types';
import { properties, roommates, maids, services, conversations, notifications, currentUser } from '../data/mockData';
import { backendRequest } from './backendApi';

export interface LiveServiceRequest {
  id: number;
  serviceType: string;
  description?: string | null;
  address: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  estimatedPrice?: number | null;
  status: string;
  provider?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LiveConversation {
  id: number;
  otherParticipant?: { id: number; name: string; email: string; avatarUrl?: string | null } | null;
  listing?: { id: number; title: string } | null;
  lastMessage?: { id: number; content: string; createdAt: string; readAt?: string | null } | null;
  updatedAt?: string;
}

export async function createLiveServiceRequest(request: { serviceType: string; description: string; address: string; preferredDate?: string; preferredTime?: string; estimatedPrice?: number }) {
  return backendRequest<LiveServiceRequest>('/api/service-requests', { method: 'POST', body: JSON.stringify(request) });
}

export async function getLiveServiceRequests() {
  return backendRequest<{ content: LiveServiceRequest[] }>('/api/service-requests/my?size=50&sort=createdAt,desc');
}

export async function getLiveConversations() {
  return backendRequest<{ content: LiveConversation[] }>('/api/conversations?size=50&sort=updatedAt,desc');
}

export async function getLiveMessages(conversationId: number) {
  return backendRequest<{ content: Array<{ id: number; content: string; sender: { id: number }; createdAt: string; readAt?: string | null }> }>(`/api/conversations/${conversationId}/messages?size=100&sort=createdAt,asc`);
}

export async function sendLiveMessage(conversationId: number, content: string) {
  return backendRequest(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ content }) });
}

export async function startLiveConversation(recipientId: number, listingId?: number, initialMessage?: string) {
  return backendRequest<LiveConversation>('/api/conversations', { method: 'POST', body: JSON.stringify({ recipientId, listingId, initialMessage }) });
}

export async function startLiveConversationByEmail(recipientEmail: string, initialMessage?: string) {
  return backendRequest<LiveConversation>('/api/conversations', { method: 'POST', body: JSON.stringify({ recipientEmail, initialMessage }) });
}

export async function createLiveReport(request: { listingId?: number; reportedUserId?: number; targetName?: string; targetAddress?: string; reason: string; description?: string }) {
  return backendRequest('/api/reports', { method: 'POST', body: JSON.stringify(request) });
}

// ==================== API SERVICE ABSTRACTION ====================
// These functions return mock data for now.
// Replace with REST API calls when Spring Boot backend is ready.

// ---- Properties ----
export async function getProperties(filters?: Partial<FilterState>): Promise<Property[]> {
  let result = [...properties];
  if (filters) {
    if (filters.budget) {
      result = result.filter(p => p.rent >= filters.budget![0] && p.rent <= filters.budget![1]);
    }
    if (filters.gender && filters.gender.length > 0) {
      result = result.filter(p => filters.gender!.includes(p.gender));
    }
    if (filters.roomType && filters.roomType.length > 0) {
      result = result.filter(p => filters.roomType!.includes(p.roomType));
    }
    if (filters.ac !== null && filters.ac !== undefined) {
      result = result.filter(p => p.ac === filters.ac);
    }
    if (filters.foodIncluded !== null && filters.foodIncluded !== undefined) {
      result = result.filter(p => p.foodIncluded === filters.foodIncluded);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter(p => filters.amenities!.every(a => p.amenities.includes(a)));
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.area.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
  }
  return result;
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  return properties.find(p => p.id === id);
}

// ---- Roommates ----
export async function getRoommates(): Promise<Roommate[]> {
  return roommates;
}

export async function getRoommateById(id: string): Promise<Roommate | undefined> {
  return roommates.find(r => r.id === id);
}

// ---- Maids ----
export async function getMaids(): Promise<Maid[]> {
  return maids;
}

// ---- Services ----
export async function getServices(): Promise<Service[]> {
  return services;
}

// ---- Conversations ----
export async function getConversations(): Promise<Conversation[]> {
  return conversations;
}

// ---- Notifications ----
export async function getNotifications(): Promise<Notification[]> {
  return notifications;
}

// ---- User ----
export async function getCurrentUser(): Promise<User> {
  return currentUser;
}

// ---- Mutations (mock) ----
export async function saveProperty(_propertyId: string): Promise<void> {
  // Mock: would POST to /api/user/saved-properties
}

export async function sendMessage(_conversationId: string, _text: string): Promise<void> {
  // Mock: would POST to /api/messages
}

export async function createServiceRequest(_serviceType: string, _details: string): Promise<void> {
  // Mock: would POST to /api/service-requests
}

export async function createRoommateRequest(_data: Partial<Roommate>): Promise<void> {
  // Mock: would POST to /api/roommate-requests
}

export async function login(_email: string, _password: string): Promise<User> {
  // Mock: would POST to /api/auth/login
  return currentUser;
}

export async function signup(_data: Record<string, string>): Promise<User> {
  // Mock: would POST to /api/auth/signup
  return currentUser;
}
