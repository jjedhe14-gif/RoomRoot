package com.roomroot.backend.message.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.message.Message;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageResponse {

    private Long id;
    private Long conversationId;
    private UserResponse sender;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public MessageResponse() {
    }

    public static MessageResponse fromEntity(Message message) {
        if (message == null) return null;
        MessageResponse dto = new MessageResponse();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversation().getId());
        dto.setSender(UserResponse.fromEntity(message.getSender()));
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setReadAt(message.getReadAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public UserResponse getSender() {
        return sender;
    }

    public void setSender(UserResponse sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}
