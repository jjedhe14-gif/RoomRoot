package com.roomroot.backend.service.dto;

import com.roomroot.backend.service.ServiceRequest;
import com.roomroot.backend.service.ServiceRequestStatus;
import com.roomroot.backend.user.dto.UserResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ServiceRequestResponse {
    private Long id; private UserResponse user; private String serviceType; private String description;
    private String address; private LocalDate preferredDate; private String preferredTime; private Integer estimatedPrice;
    private ServiceRequestStatus status; private String provider; private LocalDateTime createdAt; private LocalDateTime updatedAt;
    public static ServiceRequestResponse fromEntity(ServiceRequest entity) {
        ServiceRequestResponse response = new ServiceRequestResponse(); response.id = entity.getId(); response.user = UserResponse.fromEntity(entity.getUser());
        response.serviceType = entity.getServiceType(); response.description = entity.getDescription(); response.address = entity.getAddress();
        response.preferredDate = entity.getPreferredDate(); response.preferredTime = entity.getPreferredTime(); response.estimatedPrice = entity.getEstimatedPrice();
        response.status = entity.getStatus(); response.provider = entity.getProvider(); response.createdAt = entity.getCreatedAt(); response.updatedAt = entity.getUpdatedAt(); return response;
    }
    public Long getId() { return id; } public UserResponse getUser() { return user; } public String getServiceType() { return serviceType; }
    public String getDescription() { return description; } public String getAddress() { return address; } public LocalDate getPreferredDate() { return preferredDate; }
    public String getPreferredTime() { return preferredTime; } public Integer getEstimatedPrice() { return estimatedPrice; } public ServiceRequestStatus getStatus() { return status; }
    public String getProvider() { return provider; } public LocalDateTime getCreatedAt() { return createdAt; } public LocalDateTime getUpdatedAt() { return updatedAt; }
}