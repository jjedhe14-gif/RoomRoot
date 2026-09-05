package com.roomroot.backend.message.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.message.Conversation;
import com.roomroot.backend.message.Message;
import com.roomroot.backend.user.dto.UserResponse;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversationResponse {

    private Long id;
    private UserResponse otherParticipant;
    private ListingResponse listing;
    private MessageResponse lastMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ConversationResponse() {
    }

    public static ConversationResponse fromEntity(Conversation conversation, Long currentUserId, Message lastMessage) {
        if (conversation == null) return null;
        ConversationResponse dto = new ConversationResponse();
        dto.setId(conversation.getId());
        dto.setOtherParticipant(UserResponse.fromEntity(conversation.getOtherParticipant(currentUserId)));
        if (conversation.getListing() != null) {
            dto.setListing(ListingResponse.fromEntity(conversation.getListing()));
        }
        if (lastMessage != null) {
            dto.setLastMessage(MessageResponse.fromEntity(lastMessage));
        }
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

    public UserResponse getOtherParticipant() {
        return otherParticipant;
    }

    public void setOtherParticipant(UserResponse otherParticipant) {
        this.otherParticipant = otherParticipant;
    }

    public ListingResponse getListing() {
        return listing;
    }

    public void setListing(ListingResponse listing) {
        this.listing = listing;
    }

    public MessageResponse getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(MessageResponse lastMessage) {
        this.lastMessage = lastMessage;
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
