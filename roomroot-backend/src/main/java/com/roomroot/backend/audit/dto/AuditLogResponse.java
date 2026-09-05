package com.roomroot.backend.audit.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.audit.AuditLog;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditLogResponse {

    private Long id;
    private Long actorUserId;
    private String actorName;
    private String actorEmail;
    private String action;
    private String entityType;
    private Long entityId;
    private String description;
    private String oldValue;
    private String newValue;
    private String metadata;
    private LocalDateTime createdAt;

    public AuditLogResponse() {
    }

    public static AuditLogResponse fromEntity(AuditLog log) {
        if (log == null) return null;
        AuditLogResponse dto = new AuditLogResponse();
        dto.setId(log.getId());
        dto.setActorUserId(log.getActorUserId());
        dto.setActorName(log.getActorName());
        dto.setActorEmail(log.getActorEmail());
        dto.setAction(log.getAction());
        dto.setEntityType(log.getEntityType());
        dto.setEntityId(log.getEntityId());
        dto.setDescription(log.getDescription());
        dto.setOldValue(log.getOldValue());
        dto.setNewValue(log.getNewValue());
        dto.setMetadata(log.getMetadata());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(Long actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
