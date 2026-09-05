package com.roomroot.backend.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.application.Application;
import com.roomroot.backend.application.ApplicationStatus;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationResponse {

    private Long id;
    private UserResponse student;
    private ListingResponse listing;
    private String message;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {
    }

    public static ApplicationResponse fromEntity(Application application) {
        if (application == null) return null;
        ApplicationResponse dto = new ApplicationResponse();
        dto.setId(application.getId());
        dto.setStudent(UserResponse.fromEntity(application.getStudent()));
        dto.setListing(ListingResponse.fromEntity(application.getListing()));
        dto.setMessage(application.getMessage());
        dto.setStatus(application.getStatus());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getStudent() {
        return student;
    }

    public void setStudent(UserResponse student) {
        this.student = student;
    }

    public ListingResponse getListing() {
        return listing;
    }

    public void setListing(ListingResponse listing) {
        this.listing = listing;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
