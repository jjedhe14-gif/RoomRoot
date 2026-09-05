package com.roomroot.backend.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.auth.VerificationCode;

import java.time.LocalDateTime;

/**
 * Verification/OTP activity entry for admins.
 *
 * <p>Security note: raw OTP codes are NEVER serialized. Only lifecycle metadata
 * (requested/expiry/used timestamps and a derived status) is exposed.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VerificationResponse {

    public enum Status {
        ACTIVE,
        USED,
        EXPIRED
    }

    private Long id;
    private String email;
    private Status status;
    private boolean verified;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;

    public VerificationResponse() {
    }

    public static VerificationResponse fromEntity(VerificationCode code) {
        if (code == null) return null;
        VerificationResponse dto = new VerificationResponse();
        dto.setId(code.getId());
        dto.setEmail(code.getEmail());
        dto.setVerified(code.isVerified());
        dto.setCreatedAt(code.getCreatedAt());
        dto.setExpiresAt(code.getExpiresAt());
        dto.setUsedAt(code.getUsedAt());
        dto.setStatus(deriveStatus(code));
        return dto;
    }

    private static Status deriveStatus(VerificationCode code) {
        if (code.isVerified()) {
            return Status.USED;
        }
        if (code.getExpiresAt() != null && LocalDateTime.now().isAfter(code.getExpiresAt())) {
            return Status.EXPIRED;
        }
        return Status.ACTIVE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }
}
