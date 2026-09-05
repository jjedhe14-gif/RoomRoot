// ==================== Admin Dashboard Types ====================
// These mirror the RoomRoot backend admin DTOs.

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Spring Data pages may serialize metadata either nested under `page`
 * (VIA_DTO mode) or flat at the top level. Both shapes are normalized.
 */
export interface ApiPage<T> {
  content: T[];
  page?: PageInfo;
  // Legacy/flat fallbacks
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

export interface AdminUserBrief {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  suspensionReason?: string | null;
  emailVerified: boolean;
  avatarUrl?: string | null;
}

export interface AdminUser extends AdminUserBrief {
  phone?: string | null;
  university?: string | null;
  course?: string | null;
  yearOfStudy?: number | null;
  budget?: number | null;
  preferredLocation?: string | null;
  bio?: string | null;
  genderPreference?: string | null;
  smokingPreference?: string | null;
  cleanlinessPreference?: string | null;
  sleepSchedule?: string | null;
  createdAt?: string | null;
}

export interface AdminUserDetail extends AdminUser {
  totalListings: number;
  totalApplications: number;
  totalFavorites: number;
  totalReviews: number;
}

export interface AdminListing {
  id: number;
  owner?: AdminUser | null;
  title: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  locality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  monthlyRent?: number | null;
  securityDeposit?: number | null;
  available?: boolean;
  roomType?: string | null;
  furnished?: string | null;
  bathroomType?: string | null;
  genderPreference?: string | null;
  totalRooms?: number | null;
  availableRooms?: number | null;
  status: string;
  images?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminApplication {
  id: number;
  student?: AdminUser | null;
  listing?: AdminListing | null;
  message?: string | null;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type VerificationStatus = 'ACTIVE' | 'USED' | 'EXPIRED';

export interface VerificationEntry {
  id: number;
  email: string;
  status: VerificationStatus;
  verified: boolean;
  createdAt?: string | null;
  expiresAt?: string | null;
  usedAt?: string | null;
}

export interface AdminReport {
  id: number;
  reporter?: AdminUser | null;
  reportedUser?: AdminUser | null;
  listing?: AdminListing | null;
  reason: string;
  description?: string | null;
  targetName?: string | null;
  targetAddress?: string | null;
  status: string;
  createdAt?: string | null;
}

export interface AdminConversation {
  id: number;
  participant1?: AdminUserBrief | null;
  participant2?: AdminUserBrief | null;
  listingId?: number | null;
  listingTitle?: string | null;
  messageCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminNotificationEntry {
  id: number;
  recipient?: AdminUserBrief | null;
  title?: string | null;
  type: string;
  read: boolean;
  createdAt?: string | null;
}

export interface AuditLogEntry {
  id: number;
  actorUserId?: number | null;
  actorName?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: number | null;
  description?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  metadata?: string | null;
  createdAt?: string | null;
}

export interface AdminStats {
  // Users
  totalUsers: number;
  totalStudents: number;
  totalOwners: number;
  totalAdmins: number;
  activeUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  newUsersLast7Days: number;
  newUsersToday: number;
  // Listings
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  rejectedListings: number;
  suspendedListings: number;
  // Applications
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  // Reports
  totalReports: number;
  pendingReports: number;
  reviewingReports: number;
  resolvedReports: number;
  // Communication & engagement
  totalConversations: number;
  totalMessages: number;
  totalNotifications: number;
  totalFavorites: number;
  totalReviews: number;
  // Activity
  eventsLast24Hours: number;
  eventsLast7Days: number;
}

export interface AdminServiceRequest {
  id: number;
  user?: AdminUser | null;
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

export interface SystemOverview {
  service: string;
  status: string;
  databaseStatus: string;
  applicationVersion: string;
  apiVersion: string;
  javaVersion: string;
  serverTime?: string | null;
  recordCounts: Record<string, number>;
}
