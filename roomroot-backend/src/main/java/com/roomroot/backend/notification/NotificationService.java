package com.roomroot.backend.notification;

import com.roomroot.backend.exception.ForbiddenException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.notification.dto.NotificationResponse;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Transactional
    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(String userEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(userEmail);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(NotificationResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = userService.findByEmailOrThrow(userEmail);
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, String userEmail) {
        User user = userService.findByEmailOrThrow(userEmail);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You cannot access another user's notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(updated);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userService.findByEmailOrThrow(userEmail);
        notificationRepository.markAllAsReadForUser(user);
    }
}
