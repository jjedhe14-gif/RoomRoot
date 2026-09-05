package com.roomroot.backend.admin;

/**
 * Best-effort application version resolution. Falls back to the pom version
 * string when the running jar has no implementation metadata (e.g. dev mode).
 */
final class RoomRootVersion {

    private static final String FALLBACK = "0.0.1-SNAPSHOT";

    private RoomRootVersion() {
    }

    static String get() {
        String version = RoomRootVersion.class.getPackage().getImplementationVersion();
        return version != null && !version.isBlank() ? version : FALLBACK;
    }
}
