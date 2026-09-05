package com.roomroot.backend.application.dto;

import jakarta.validation.constraints.Size;

public class ApplicationRequest {

    @Size(max = 1000, message = "Application message cannot exceed 1000 characters")
    private String message;

    public ApplicationRequest() {
    }

    public ApplicationRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
