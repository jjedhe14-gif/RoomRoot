package com.roomroot.backend.api;

import com.roomroot.backend.admin.AdminService;
import com.roomroot.backend.admin.dto.AdminConversationResponse;
import com.roomroot.backend.admin.dto.AdminNotificationResponse;
import com.roomroot.backend.admin.dto.AdminStatsResponse;
import com.roomroot.backend.admin.dto.AdminUserDetailResponse;
import com.roomroot.backend.admin.dto.SystemOverviewResponse;
import com.roomroot.backend.admin.dto.UpdateListingStatusRequest;
import com.roomroot.backend.admin.dto.UpdateUserStatusRequest;
import com.roomroot.backend.admin.dto.VerificationResponse;
import com.roomroot.backend.application.ApplicationStatus;
import com.roomroot.backend.application.dto.ApplicationResponse;
import com.roomroot.backend.audit.dto.AuditLogResponse;
import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.listing.ListingStatus;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.notification.NotificationType;
import com.roomroot.backend.report.ReportStatus;
import com.roomroot.backend.report.dto.ReportResponse;
import com.roomroot.backend.report.dto.UpdateReportStatusRequest;
import com.roomroot.backend.user.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administration and platform moderation endpoints (Requires ADMIN role)")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all users with optional filters by role, status, verification and search")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean emailVerified,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserResponse> users = adminService.getUsers(role, status, emailVerified, search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get full user detail with related-entity counters (admin)")
    public ResponseEntity<ApiResponse<AdminUserDetailResponse>> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User details fetched successfully", adminService.getUserDetail(id)));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user status (ACTIVE, SUSPENDED, DELETED, PENDING)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        UserResponse response = adminService.updateUserStatus(id, request.getStatus(), request.getReason(), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User status updated", response));
    }

    @GetMapping("/listings")
    @Operation(summary = "List all listings with optional status filter and search")
    public ResponseEntity<ApiResponse<Page<ListingResponse>>> getListings(
            @RequestParam(required = false) ListingStatus status,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ListingResponse> listings = adminService.getListings(status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Listings fetched successfully", listings));
    }

    @PatchMapping("/listings/{id}/status")
    @Operation(summary = "Moderate listing status (ACTIVE, REJECTED, SUSPENDED, PENDING_REVIEW)")
    public ResponseEntity<ApiResponse<ListingResponse>> updateListingStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateListingStatusRequest request) {
        ListingResponse response = adminService.updateListingStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing status updated", response));
    }

    @DeleteMapping("/listings/{id}")
    @Operation(summary = "Admin permanently delete a listing")
    public ResponseEntity<ApiResponse<Void>> deleteListing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        adminService.deleteListing(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing deleted by administrator"));
    }

    @GetMapping("/applications")
    @Operation(summary = "List platform applications with optional status filter and search")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Applications fetched successfully",
                adminService.getApplications(status, search, pageable)));
    }

    @GetMapping("/verifications")
    @Operation(summary = "List OTP/email verification activity (codes are never exposed)")
    public ResponseEntity<ApiResponse<Page<VerificationResponse>>> getVerifications(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Verification activity fetched successfully",
                adminService.getVerifications(email, status, pageable)));
    }

    @GetMapping("/reports")
    @Operation(summary = "List platform reports with optional status filter")
    public ResponseEntity<ApiResponse<Page<ReportResponse>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReportResponse> reports = adminService.getReports(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Reports fetched successfully", reports));
    }

    @GetMapping("/reports/{id}")
    @Operation(summary = "Get report details by ID")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Report details fetched successfully", adminService.getReportById(id)));
    }

    @PatchMapping("/reports/{id}/status")
    @Operation(summary = "Update report status (RESOLVED, DISMISSED, REVIEWING)")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReportStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        ReportResponse response = adminService.updateReportStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Report status updated", response));
    }

    @GetMapping("/conversations")
    @Operation(summary = "List conversation metadata (message content is never exposed)")
    public ResponseEntity<ApiResponse<Page<AdminConversationResponse>>> getConversations(
            @ParameterObject @PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Conversations fetched successfully",
                adminService.getConversations(pageable)));
    }

    @GetMapping("/notifications")
    @Operation(summary = "List platform notifications with optional type/read filters")
    public ResponseEntity<ApiResponse<Page<AdminNotificationResponse>>> getNotifications(
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) Boolean read,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully",
                adminService.getNotifications(type, read, search, pageable)));
    }

    @GetMapping("/activity")
    @Operation(summary = "List audit/activity log entries with filters")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getActivity(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long actorUserId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Activity log fetched successfully",
                adminService.getActivity(action, entityType, actorUserId, search, from, to, pageable)));
    }

    @GetMapping("/system")
    @Operation(summary = "Get system/backend health overview and record counts (no secrets)")
    public ResponseEntity<ApiResponse<SystemOverviewResponse>> getSystemOverview() {
        return ResponseEntity.ok(ApiResponse.success("System overview fetched successfully",
                adminService.getSystemOverview()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform metrics and statistics")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success("Platform statistics fetched", stats));
    }
}
