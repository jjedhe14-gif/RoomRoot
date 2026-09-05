package com.roomroot.backend.report.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.report.Report;
import com.roomroot.backend.report.ReportStatus;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportResponse {

    private Long id;
    private UserResponse reporter;
    private UserResponse reportedUser;
    private ListingResponse listing;
    private String reason;
    private String description;
    private String targetName;
    private String targetAddress;
    private ReportStatus status;
    private LocalDateTime createdAt;

    public ReportResponse() {
    }

    public static ReportResponse fromEntity(Report report) {
        if (report == null) return null;
        ReportResponse dto = new ReportResponse();
        dto.setId(report.getId());
        dto.setReporter(UserResponse.fromEntity(report.getReporter()));
        if (report.getReportedUser() != null) {
            dto.setReportedUser(UserResponse.fromEntity(report.getReportedUser()));
        }
        if (report.getListing() != null) {
            dto.setListing(ListingResponse.fromEntity(report.getListing()));
        }
        dto.setReason(report.getReason());
        dto.setDescription(report.getDescription());
        dto.setTargetName(report.getTargetName());
        dto.setTargetAddress(report.getTargetAddress());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getReporter() {
        return reporter;
    }

    public void setReporter(UserResponse reporter) {
        this.reporter = reporter;
    }

    public UserResponse getReportedUser() {
        return reportedUser;
    }

    public void setReportedUser(UserResponse reportedUser) {
        this.reportedUser = reportedUser;
    }

    public ListingResponse getListing() {
        return listing;
    }

    public void setListing(ListingResponse listing) {
        this.listing = listing;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }
    public String getTargetAddress() { return targetAddress; }
    public void setTargetAddress(String targetAddress) { this.targetAddress = targetAddress; }

    public void setDescription(String description) {
        this.description = description;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
