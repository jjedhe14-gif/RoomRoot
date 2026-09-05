package com.roomroot.backend.admin.dto;

/**
 * Platform-wide counters consumed by the admin dashboard overview.
 *
 * <p>Field names intentionally mirror what the dashboard needs to render its
 * statistic cards without extra round-trips.
 */
public class AdminStatsResponse {

    // Users
    private long totalUsers;
    private long totalStudents;
    private long totalOwners;
    private long totalAdmins;
    private long activeUsers;
    private long suspendedUsers;
    private long verifiedUsers;
    private long unverifiedUsers;
    private long newUsersLast7Days;
    private long newUsersToday;

    // Listings
    private long totalListings;
    private long activeListings;
    private long pendingListings;
    private long rejectedListings;
    private long suspendedListings;

    // Applications
    private long totalApplications;
    private long pendingApplications;
    private long acceptedApplications;
    private long rejectedApplications;

    // Reports
    private long totalReports;
    private long pendingReports;
    private long reviewingReports;
    private long resolvedReports;

    // Communication & engagement
    private long totalConversations;
    private long totalMessages;
    private long totalNotifications;
    private long totalFavorites;
    private long totalReviews;

    // Activity
    private long eventsLast24Hours;
    private long eventsLast7Days;

    public AdminStatsResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalOwners() {
        return totalOwners;
    }

    public void setTotalOwners(long totalOwners) {
        this.totalOwners = totalOwners;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getSuspendedUsers() {
        return suspendedUsers;
    }

    public void setSuspendedUsers(long suspendedUsers) {
        this.suspendedUsers = suspendedUsers;
    }

    public long getVerifiedUsers() {
        return verifiedUsers;
    }

    public void setVerifiedUsers(long verifiedUsers) {
        this.verifiedUsers = verifiedUsers;
    }

    public long getUnverifiedUsers() {
        return unverifiedUsers;
    }

    public void setUnverifiedUsers(long unverifiedUsers) {
        this.unverifiedUsers = unverifiedUsers;
    }

    public long getNewUsersLast7Days() {
        return newUsersLast7Days;
    }

    public void setNewUsersLast7Days(long newUsersLast7Days) {
        this.newUsersLast7Days = newUsersLast7Days;
    }

    public long getNewUsersToday() {
        return newUsersToday;
    }

    public void setNewUsersToday(long newUsersToday) {
        this.newUsersToday = newUsersToday;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getActiveListings() {
        return activeListings;
    }

    public void setActiveListings(long activeListings) {
        this.activeListings = activeListings;
    }

    public long getPendingListings() {
        return pendingListings;
    }

    public void setPendingListings(long pendingListings) {
        this.pendingListings = pendingListings;
    }

    public long getRejectedListings() {
        return rejectedListings;
    }

    public void setRejectedListings(long rejectedListings) {
        this.rejectedListings = rejectedListings;
    }

    public long getSuspendedListings() {
        return suspendedListings;
    }

    public void setSuspendedListings(long suspendedListings) {
        this.suspendedListings = suspendedListings;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getAcceptedApplications() {
        return acceptedApplications;
    }

    public void setAcceptedApplications(long acceptedApplications) {
        this.acceptedApplications = acceptedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getReviewingReports() {
        return reviewingReports;
    }

    public void setReviewingReports(long reviewingReports) {
        this.reviewingReports = reviewingReports;
    }

    public long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(long resolvedReports) {
        this.resolvedReports = resolvedReports;
    }

    public long getTotalConversations() {
        return totalConversations;
    }

    public void setTotalConversations(long totalConversations) {
        this.totalConversations = totalConversations;
    }

    public long getTotalMessages() {
        return totalMessages;
    }

    public void setTotalMessages(long totalMessages) {
        this.totalMessages = totalMessages;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public long getEventsLast24Hours() {
        return eventsLast24Hours;
    }

    public void setEventsLast24Hours(long eventsLast24Hours) {
        this.eventsLast24Hours = eventsLast24Hours;
    }

    public long getEventsLast7Days() {
        return eventsLast7Days;
    }

    public void setEventsLast7Days(long eventsLast7Days) {
        this.eventsLast7Days = eventsLast7Days;
    }
}
