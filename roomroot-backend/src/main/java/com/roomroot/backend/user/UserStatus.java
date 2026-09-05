package com.roomroot.backend.user;

public class UserStatus {
    public static final String ACTIVE = "ACTIVE";
    public static final String SUSPENDED = "SUSPENDED";
    public static final String DELETED = "DELETED";
    public static final String PENDING = "PENDING";

    private UserStatus() {}

    public static boolean isValid(String status) {
        if (status == null) return false;
        String s = status.toUpperCase();
        return ACTIVE.equals(s) || SUSPENDED.equals(s) || DELETED.equals(s) || PENDING.equals(s);
    }
}
