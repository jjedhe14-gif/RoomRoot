package com.roomroot.backend.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.user.User;

/**
 * Minimal user representation for admin-only lists. Contains only the fields
 * needed for identification to avoid leaking full profiles in list endpoints.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminUserBrief {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private boolean emailVerified;
    private String avatarUrl;

    public AdminUserBrief() {
    }

    public static AdminUserBrief fromEntity(User user) {
        if (user == null) return null;
        AdminUserBrief dto = new AdminUserBrief();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
