package com.roomroot.backend.admin.dto;

import com.roomroot.backend.user.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateUserStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    @Size(max = 1000, message = "Suspension reason must be 1000 characters or fewer")
    private String reason;

    public UpdateUserStatusRequest() {
    }

    public UpdateUserStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public boolean isValid() {
        return UserStatus.isValid(status);
    }
}
