package com.roomroot.backend.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ServiceRequestCreateRequest {
    @NotBlank @Size(max = 100) private String serviceType;
    @Size(max = 2000) private String description;
    @NotBlank @Size(max = 500) private String address;
    private LocalDate preferredDate;
    private String preferredTime;
    private Integer estimatedPrice;
    public String getServiceType() { return serviceType; }
    public void setServiceType(String value) { serviceType = value; }
    public String getDescription() { return description; }
    public void setDescription(String value) { description = value; }
    public String getAddress() { return address; }
    public void setAddress(String value) { address = value; }
    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate value) { preferredDate = value; }
    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String value) { preferredTime = value; }
    public Integer getEstimatedPrice() { return estimatedPrice; }
    public void setEstimatedPrice(Integer value) { estimatedPrice = value; }
}