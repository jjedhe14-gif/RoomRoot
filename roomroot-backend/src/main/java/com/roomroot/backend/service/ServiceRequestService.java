package com.roomroot.backend.service;

import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.service.dto.ServiceRequestCreateRequest;
import com.roomroot.backend.service.dto.ServiceRequestResponse;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceRequestService {
    private final ServiceRequestRepository repository;
    private final UserService userService;
    private final AuditLogService auditLogService;

    public ServiceRequestService(ServiceRequestRepository repository, UserService userService, AuditLogService auditLogService) {
        this.repository = repository;
        this.userService = userService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ServiceRequestResponse create(String email, ServiceRequestCreateRequest request) {
        User user = userService.findByEmailOrThrow(email);
        ServiceRequest entity = new ServiceRequest();
        entity.setUser(user);
        entity.setServiceType(request.getServiceType().trim());
        entity.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        entity.setAddress(request.getAddress().trim());
        entity.setPreferredDate(request.getPreferredDate());
        entity.setPreferredTime(request.getPreferredTime());
        entity.setEstimatedPrice(request.getEstimatedPrice());
        ServiceRequest saved = repository.save(entity);
        auditLogService.record(AuditActions.SERVICE_REQUEST_CREATED, "SERVICE_REQUEST", saved.getId(),
                user.getName() + " requested " + saved.getServiceType() + " service", user);
        return ServiceRequestResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<ServiceRequestResponse> mine(String email, Pageable pageable) {
        return repository.findByUser(userService.findByEmailOrThrow(email), pageable).map(ServiceRequestResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ServiceRequestResponse> all(ServiceRequestStatus status, Pageable pageable) {
        return (status == null ? repository.findAll(pageable) : repository.findByStatus(status, pageable)).map(ServiceRequestResponse::fromEntity);
    }

    @Transactional
    public ServiceRequestResponse updateStatus(Long id, ServiceRequestStatus status, String actorEmail) {
        ServiceRequest entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service request not found: " + id));
        ServiceRequestStatus previous = entity.getStatus(); entity.setStatus(status);
        ServiceRequest saved = repository.save(entity);
        User actor = userService.findByEmailOrThrow(actorEmail);
        auditLogService.record(AuditActions.SERVICE_REQUEST_STATUS_CHANGED, "SERVICE_REQUEST", id,
                "Service request #" + id + " status changed from " + previous + " to " + status, actor,
                previous.name(), status.name(), null);
        return ServiceRequestResponse.fromEntity(saved);
    }
}
