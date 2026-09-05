package com.roomroot.backend.application.dto;

import com.roomroot.backend.application.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicationStatusRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    public UpdateApplicationStatusRequest() {
    }

    public UpdateApplicationStatusRequest(ApplicationStatus status) {
        this.status = status;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
