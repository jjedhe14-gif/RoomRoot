package com.roomroot.backend.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.notification.Notification;
import com.roomroot.backend.notification.NotificationType;

import java.time.LocalDateTime;

/**
 * Platform notification entry for admins. The message body is intentionally
 * omitted: notification bodies for MESSAGE-type notifications contain private
 * chat content, so admins see recipient, type, read state and title only.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminNotificationResponse {

    private Long id;
    private AdminUserBrief recipient;
    private String title;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;

    public AdminNotificationResponse() {
    }

    public static AdminNotificationResponse fromEntity(Notification notification) {
        if (notification == null) return null;
        AdminNotificationResponse dto = new AdminNotificationResponse();
        dto.setId(notification.getId());
        dto.setRecipient(AdminUserBrief.fromEntity(notification.getUser()));
        dto.setTitle(notification.getTitle());
        dto.setType(notification.getType());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdminUserBrief getRecipient() {
        return recipient;
    }

    public void setRecipient(AdminUserBrief recipient) {
        this.recipient = recipient;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
