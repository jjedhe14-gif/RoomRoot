package com.roomroot.backend.audit;

/**
 * Canonical audit action names.
 *
 * <p>These values are stored as plain strings in the audit_logs table so the set of
 * actions can grow without schema changes. Never store secrets (passwords, JWT
 * tokens, OTP codes) inside audit records.
 */
public final class AuditActions {

    private AuditActions() {
    }

    // Auth & users
    public static final String USER_REGISTERED = "USER_REGISTERED";
    public static final String USER_VERIFIED = "USER_VERIFIED";
    public static final String USER_STATUS_CHANGED = "USER_STATUS_CHANGED";
    public static final String USER_PROFILE_UPDATED = "USER_PROFILE_UPDATED";
    public static final String ADMIN_ACTION = "ADMIN_ACTION";

    // OTP / verification
    public static final String OTP_REQUESTED = "OTP_REQUESTED";
    public static final String OTP_VERIFIED = "OTP_VERIFIED";

    // Listings
    public static final String LISTING_CREATED = "LISTING_CREATED";
    public static final String LISTING_UPDATED = "LISTING_UPDATED";
    public static final String LISTING_STATUS_CHANGED = "LISTING_STATUS_CHANGED";
    public static final String LISTING_DELETED = "LISTING_DELETED";

    // Applications
    public static final String APPLICATION_CREATED = "APPLICATION_CREATED";
    public static final String APPLICATION_STATUS_CHANGED = "APPLICATION_STATUS_CHANGED";

    // Reports
    public static final String REPORT_CREATED = "REPORT_CREATED";
    public static final String REPORT_STATUS_CHANGED = "REPORT_STATUS_CHANGED";

    // Service requests
    public static final String SERVICE_REQUEST_CREATED = "SERVICE_REQUEST_CREATED";
    public static final String SERVICE_REQUEST_STATUS_CHANGED = "SERVICE_REQUEST_STATUS_CHANGED";

    // Messaging
    public static final String CONVERSATION_CREATED = "CONVERSATION_CREATED";
}
