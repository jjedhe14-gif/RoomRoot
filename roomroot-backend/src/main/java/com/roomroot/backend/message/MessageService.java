package com.roomroot.backend.message;

import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.exception.ForbiddenException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.message.dto.ConversationResponse;
import com.roomroot.backend.message.dto.CreateConversationRequest;
import com.roomroot.backend.message.dto.MessageRequest;
import com.roomroot.backend.message.dto.MessageResponse;
import com.roomroot.backend.notification.NotificationService;
import com.roomroot.backend.notification.NotificationType;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserRepository;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ListingService listingService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public MessageService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository,
            UserService userService,
            ListingService listingService,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.listingService = listingService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ConversationResponse startConversation(String userEmail, CreateConversationRequest request) {
        User sender = userService.findByEmailOrThrow(userEmail);

        User recipient = request.getRecipientId() != null
                ? userRepository.findById(request.getRecipientId()).orElseThrow(() -> new ResourceNotFoundException("Recipient user not found with id: " + request.getRecipientId()))
                : request.getRecipientEmail() == null ? null : userRepository.findByEmail(request.getRecipientEmail().trim().toLowerCase()).orElse(null);
        if (recipient == null) {
            throw new ResourceNotFoundException("Recipient user not found");
        }
        if (sender.getId().equals(recipient.getId())) {
            throw new BadRequestException("You cannot start a conversation with yourself");
        }

        Listing listing = null;
        if (request.getListingId() != null) {
            listing = listingService.findEntityById(request.getListingId());
        }

        boolean[] createdNew = {false};
        Conversation conversation = conversationRepository.findBetweenUsers(sender, recipient)
                .orElseGet(() -> {
                    createdNew[0] = true;
                    Conversation newConv = new Conversation();
                    newConv.setParticipant1(sender);
                    newConv.setParticipant2(recipient);
                    return newConv;
                });

        if (listing != null) {
            conversation.setListing(listing);
        }
        conversation.setUpdatedAt(LocalDateTime.now());
        Conversation savedConv = conversationRepository.save(conversation);

        if (createdNew[0]) {
            auditLogService.record(AuditActions.CONVERSATION_CREATED, "CONVERSATION", savedConv.getId(),
                    sender.getName() + " started a conversation with " + recipient.getName(), sender);
        }

        Message lastMessage = null;
        if (request.getInitialMessage() != null && !request.getInitialMessage().trim().isEmpty()) {
            Message message = new Message(savedConv, sender, request.getInitialMessage().trim());
            lastMessage = messageRepository.save(message);

            // Notify recipient
            notificationService.createNotification(
                    recipient,
                    "New message from " + sender.getName(),
                    request.getInitialMessage().trim(),
                    NotificationType.MESSAGE
            );
        }

        return ConversationResponse.fromEntity(savedConv, sender.getId(), lastMessage);
    }

    @Transactional(readOnly = true)
    public Page<ConversationResponse> getUserConversations(String userEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(userEmail);
        return conversationRepository.findByUser(user, pageable)
                .map(conv -> {
                    Message lastMsg = messageRepository.findTopByConversationOrderByCreatedAtDesc(conv).orElse(null);
                    return ConversationResponse.fromEntity(conv, user.getId(), lastMsg);
                });
    }

    @Transactional
    public Page<MessageResponse> getConversationMessages(Long conversationId, String userEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(userEmail);
        Conversation conversation = findConversationOrThrow(conversationId);

        if (!conversation.isParticipant(user.getId())) {
            throw new ForbiddenException("You are not a participant in this conversation");
        }

        // Mark unread messages sent by the other user as read
        messageRepository.markConversationMessagesAsRead(conversation, user, LocalDateTime.now());

        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation, pageable)
                .map(MessageResponse::fromEntity);
    }

    @Transactional
    public MessageResponse sendMessage(Long conversationId, String senderEmail, MessageRequest request) {
        User sender = userService.findByEmailOrThrow(senderEmail);
        Conversation conversation = findConversationOrThrow(conversationId);

        if (!conversation.isParticipant(sender.getId())) {
            throw new ForbiddenException("You are not a participant in this conversation");
        }

        Message message = new Message(conversation, sender, request.getContent().trim());
        Message saved = messageRepository.save(message);

        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        User recipient = conversation.getOtherParticipant(sender.getId());
        notificationService.createNotification(
                recipient,
                "New message from " + sender.getName(),
                request.getContent().trim(),
                NotificationType.MESSAGE
        );

        return MessageResponse.fromEntity(saved);
    }

    @Transactional
    public MessageResponse markMessageAsRead(Long messageId, String userEmail) {
        User user = userService.findByEmailOrThrow(userEmail);
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));

        if (!message.getConversation().isParticipant(user.getId())) {
            throw new ForbiddenException("You are not part of this conversation");
        }

        if (message.getReadAt() == null && !message.getSender().getId().equals(user.getId())) {
            message.setReadAt(LocalDateTime.now());
            message = messageRepository.save(message);
        }

        return MessageResponse.fromEntity(message);
    }

    private Conversation findConversationOrThrow(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));
    }
}
