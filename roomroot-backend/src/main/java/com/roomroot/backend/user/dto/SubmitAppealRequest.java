package com.roomroot.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** A suspended user's explanation for an administrator to review. */
public class SubmitAppealRequest {
    @NotBlank(message = "Please provide a message for your appeal")
    @Size(max = 1000, message = "Appeal must be 1000 characters or fewer")
    private String message;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
