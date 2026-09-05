package com.roomroot.backend.api;

import com.roomroot.backend.application.ApplicationService;
import com.roomroot.backend.application.dto.ApplicationRequest;
import com.roomroot.backend.application.dto.ApplicationResponse;
import com.roomroot.backend.application.dto.UpdateApplicationStatusRequest;
import com.roomroot.backend.common.ApiResponse;
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
@Tag(name = "Applications", description = "Accommodation application and booking interest management")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/api/listings/{id}/applications")
    @Operation(summary = "Submit a rental application for a listing")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody(required = false) ApplicationRequest request) {
        ApplicationResponse response = applicationService.submitApplication(id, userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/api/users/me/applications")
    @Operation(summary = "Get current student's rental applications")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getStudentApplications(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Applications fetched successfully", response));
    }

    @GetMapping("/api/listings/{id}/applications")
    @Operation(summary = "Get applications for a listing (owner only)")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getListingApplications(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getListingApplications(id, userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Listing applications fetched successfully", response));
    }

    @PatchMapping("/api/applications/{id}/status")
    @Operation(summary = "Update application status (ACCEPT/REJECT by owner, WITHDRAW by student)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", response));
    }
}
