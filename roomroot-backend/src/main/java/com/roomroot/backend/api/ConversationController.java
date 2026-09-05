package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.message.MessageService;
import com.roomroot.backend.message.dto.ConversationResponse;
import com.roomroot.backend.message.dto.CreateConversationRequest;
import com.roomroot.backend.message.dto.MessageRequest;
import com.roomroot.backend.message.dto.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Messaging", description = "Student-Owner direct messaging and conversations")
public class ConversationController {

    private final MessageService messageService;

    public ConversationController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/api/conversations")
    @Operation(summary = "Start a new conversation or retrieve existing one")
    public ResponseEntity<ApiResponse<ConversationResponse>> startConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateConversationRequest request) {
        ConversationResponse response = messageService.startConversation(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Conversation initialized", response));
    }

    @GetMapping("/api/conversations")
    @Operation(summary = "Get current user's conversations")
    public ResponseEntity<ApiResponse<Page<ConversationResponse>>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {
        Page<ConversationResponse> response = messageService.getUserConversations(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Conversations fetched", response));
    }

    @GetMapping("/api/conversations/{id}/messages")
    @Operation(summary = "Get messages in a conversation (participant only)")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @ParameterObject @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<MessageResponse> response = messageService.getConversationMessages(id, userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Messages fetched", response));
    }

    @PostMapping("/api/conversations/{id}/messages")
    @Operation(summary = "Send a message within a conversation")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(id, userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent", response));
    }

    @PatchMapping("/api/messages/{id}/read")
    @Operation(summary = "Mark a message as read")
    public ResponseEntity<ApiResponse<MessageResponse>> markMessageAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        MessageResponse response = messageService.markMessageAsRead(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", response));
    }
}
