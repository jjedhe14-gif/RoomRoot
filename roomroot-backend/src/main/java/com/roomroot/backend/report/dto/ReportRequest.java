package com.roomroot.backend.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReportRequest {

    private Long reportedUserId;
    private Long listingId;
    private String targetName;
    private String targetAddress;

    @NotBlank(message = "Reason is required")
    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    public ReportRequest() {
    }

    public Long getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(Long reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }
    public String getTargetAddress() { return targetAddress; }
    public void setTargetAddress(String targetAddress) { this.targetAddress = targetAddress; }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
