// ==================== AUTH SERVICE ====================
// Uses the Spring Boot backend so OTP verification returns a real JWT and
// the persisted user role can authorize admin API requests.

import { API_BASE_URL, backendRequest } from './backendApi';

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  status: string;
  suspensionReason?: string | null;
  phone?: string;
  avatarUrl?: string;
  university?: string;
  course?: string;
  yearOfStudy?: number;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  lifestyle?: string[];
  address?: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: BackendUser;
}

export async function sendVerificationCode(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: normalizedEmail }),
  });
  const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
  if (!response.ok) {
    throw new Error(body?.message || body?.error || 'Failed to send verification code. Please try again.');
  }
}

export async function verifyCode(
  email: string,
  code: string,
  name?: string,
): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const enteredCode = code.trim();
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, code: enteredCode, name: name?.trim() || undefined }),
  });
  const body = await response.json().catch(() => null) as AuthResponse & { message?: string; error?: string } | null;
  if (!response.ok) {
    throw new Error(body?.message || body?.error || 'Unable to verify the code. Please try again.');
  }
  if (!body?.token || !body.user) {
    throw new Error('The authentication response was incomplete. Please try again.');
  }
  return body;
}

/** Refreshes the signed-in user's account status (including a live suspension). */
export function getCurrentUser(): Promise<BackendUser> {
  return backendRequest<BackendUser>('/api/users/me');
}

export function submitSuspensionAppeal(message: string): Promise<void> {
  return backendRequest<void>('/api/users/me/appeal', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export function deleteCurrentAccount(): Promise<void> {
  return backendRequest<void>('/api/users/me', { method: 'DELETE' });
}

// ---- Profile persistence helpers ----
const PROFILE_KEY = 'roomroot-profiles';

function getAllStoredProfiles(): Record<string, Partial<BackendUser>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getStoredProfile(email: string): Partial<BackendUser> | null {
  const profiles = getAllStoredProfiles();
  return profiles[email] || null;
}

export function saveProfileToStorage(email: string, profile: Partial<BackendUser>): void {
  const profiles = getAllStoredProfiles();
  profiles[email.trim().toLowerCase()] = { ...profiles[email.trim().toLowerCase()], ...profile };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}
