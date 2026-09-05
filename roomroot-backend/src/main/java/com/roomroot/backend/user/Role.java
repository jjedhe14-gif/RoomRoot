package com.roomroot.backend.user;

public class Role {
    public static final String STUDENT = "STUDENT";
    public static final String OWNER = "OWNER";
    public static final String ADMIN = "ADMIN";

    private Role() {}

    public static boolean isValid(String role) {
        if (role == null) return false;
        String r = role.toUpperCase();
        return STUDENT.equals(r) || OWNER.equals(r) || ADMIN.equals(r);
    }
}
