package com.roomroot.backend.report.dto;

import com.roomroot.backend.report.ReportStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateReportStatusRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;

    public UpdateReportStatusRequest() {
    }

    public UpdateReportStatusRequest(ReportStatus status) {
        this.status = status;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }
}
