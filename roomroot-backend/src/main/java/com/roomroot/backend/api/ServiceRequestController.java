package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.service.ServiceRequestService;
import com.roomroot.backend.service.ServiceRequestStatus;
import com.roomroot.backend.service.dto.ServiceRequestCreateRequest;
import com.roomroot.backend.service.dto.ServiceRequestResponse;
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
public class ServiceRequestController {
    private final ServiceRequestService service;
    public ServiceRequestController(ServiceRequestService service) { this.service = service; }

    @PostMapping("/api/service-requests")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> create(@AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody ServiceRequestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Service request created", service.create(user.getUsername(), request)));
    }

    @GetMapping("/api/service-requests/my")
    public ResponseEntity<ApiResponse<Page<ServiceRequestResponse>>> mine(@AuthenticationPrincipal UserDetails user,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Service requests fetched", service.mine(user.getUsername(), pageable)));
    }

    @GetMapping("/api/admin/service-requests")
    public ResponseEntity<ApiResponse<Page<ServiceRequestResponse>>> all(@RequestParam(required = false) ServiceRequestStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Service requests fetched", service.all(status, pageable)));
    }

    @PatchMapping("/api/admin/service-requests/{id}/status")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> updateStatus(@PathVariable Long id, @RequestParam ServiceRequestStatus status,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success("Service request updated", service.updateStatus(id, status, user.getUsername())));
    }
}
