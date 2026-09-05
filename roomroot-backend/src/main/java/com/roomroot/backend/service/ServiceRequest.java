package com.roomroot.backend.service;

import com.roomroot.backend.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests", indexes = {
        @Index(name = "idx_service_request_user", columnList = "user_id"),
        @Index(name = "idx_service_request_status", columnList = "status"),
        @Index(name = "idx_service_request_created", columnList = "created_at")
})
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String serviceType;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String address;

    private LocalDate preferredDate;
    private String preferredTime;
    private Integer estimatedPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceRequestStatus status = ServiceRequestStatus.REQUESTED;

    private String provider;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }
    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }
    public Integer getEstimatedPrice() { return estimatedPrice; }
    public void setEstimatedPrice(Integer estimatedPrice) { this.estimatedPrice = estimatedPrice; }
    public ServiceRequestStatus getStatus() { return status; }
    public void setStatus(ServiceRequestStatus status) { this.status = status; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public Long getIdValue() { return id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
