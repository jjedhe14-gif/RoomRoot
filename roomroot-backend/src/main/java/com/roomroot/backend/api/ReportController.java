package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.report.ReportService;
import com.roomroot.backend.report.dto.ReportRequest;
import com.roomroot.backend.report.dto.ReportResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Reports", description = "Reporting suspicious listings or users")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/api/reports")
    @Operation(summary = "Submit a report against a fake/inappropriate listing or user")
    public ResponseEntity<ApiResponse<ReportResponse>> submitReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReportRequest request) {
        ReportResponse response = reportService.createReport(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report submitted successfully. Our team will review it.", response));
    }

    @GetMapping("/api/reports/my-reports")
    @Operation(summary = "Get reports submitted by current user")
    public ResponseEntity<ApiResponse<Page<ReportResponse>>> getMyReports(
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReportResponse> response = reportService.getMyReports(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Reports fetched successfully", response));
    }
}
