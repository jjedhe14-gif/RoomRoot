package com.roomroot.backend.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.message.Conversation;

import java.time.LocalDateTime;

/**
 * Conversation metadata for admin monitoring. Deliberately excludes message
 * content - administrators see participants, related listing, message counts
 * and activity times only.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminConversationResponse {

    private Long id;
    private AdminUserBrief participant1;
    private AdminUserBrief participant2;
    private Long listingId;
    private String listingTitle;
    private long messageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminConversationResponse() {
    }

    public static AdminConversationResponse fromEntity(Conversation conversation, long messageCount) {
        if (conversation == null) return null;
        AdminConversationResponse dto = new AdminConversationResponse();
        dto.setId(conversation.getId());
        dto.setParticipant1(AdminUserBrief.fromEntity(conversation.getParticipant1()));
        dto.setParticipant2(AdminUserBrief.fromEntity(conversation.getParticipant2()));
        if (conversation.getListing() != null) {
            dto.setListingId(conversation.getListing().getId());
            dto.setListingTitle(conversation.getListing().getTitle());
        }
        dto.setMessageCount(messageCount);
        dto.setCreatedAt(conversation.getCreatedAt());
        dto.setUpdatedAt(conversation.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdminUserBrief getParticipant1() {
        return participant1;
    }

    public void setParticipant1(AdminUserBrief participant1) {
        this.participant1 = participant1;
    }

    public AdminUserBrief getParticipant2() {
        return participant2;
    }

    public void setParticipant2(AdminUserBrief participant2) {
        this.participant2 = participant2;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getListingTitle() {
        return listingTitle;
    }

    public void setListingTitle(String listingTitle) {
        this.listingTitle = listingTitle;
    }

    public long getMessageCount() {
        return messageCount;
    }

    public void setMessageCount(long messageCount) {
        this.messageCount = messageCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
