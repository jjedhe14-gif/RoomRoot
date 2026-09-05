package com.roomroot.backend.admin;

import com.roomroot.backend.admin.dto.AdminConversationResponse;
import com.roomroot.backend.admin.dto.AdminNotificationResponse;
import com.roomroot.backend.admin.dto.AdminStatsResponse;
import com.roomroot.backend.admin.dto.AdminUserBrief;
import com.roomroot.backend.admin.dto.AdminUserDetailResponse;
import com.roomroot.backend.admin.dto.SystemOverviewResponse;
import com.roomroot.backend.admin.dto.VerificationResponse;
import com.roomroot.backend.application.Application;
import com.roomroot.backend.application.ApplicationRepository;
import com.roomroot.backend.application.ApplicationStatus;
import com.roomroot.backend.application.dto.ApplicationResponse;
import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogRepository;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.audit.AuditLogSpecification;
import com.roomroot.backend.audit.dto.AuditLogResponse;
import com.roomroot.backend.auth.VerificationCode;
import com.roomroot.backend.auth.VerificationCodeRepository;
import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.favorite.FavoriteRepository;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingRepository;
import com.roomroot.backend.listing.ListingSpecification;
import com.roomroot.backend.listing.ListingStatus;
import com.roomroot.backend.listing.dto.ListingResponse;
import com.roomroot.backend.message.Conversation;
import com.roomroot.backend.message.ConversationRepository;
import com.roomroot.backend.message.MessageRepository;
import com.roomroot.backend.notification.Notification;
import com.roomroot.backend.notification.NotificationRepository;
import com.roomroot.backend.notification.NotificationSpecification;
import com.roomroot.backend.notification.NotificationType;
import com.roomroot.backend.report.ReportRepository;
import com.roomroot.backend.report.ReportService;
import com.roomroot.backend.report.ReportStatus;
import com.roomroot.backend.report.dto.ReportResponse;
import com.roomroot.backend.review.ReviewRepository;
import com.roomroot.backend.user.Role;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserRepository;
import com.roomroot.backend.user.UserService;
import com.roomroot.backend.user.UserSpecification;
import com.roomroot.backend.user.UserStatus;
import com.roomroot.backend.user.dto.UserResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final ListingRepository listingRepository;
    private final ApplicationRepository applicationRepository;
    private final ReportRepository reportRepository;
    private final ReportService reportService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditLogService auditLogService;
    private final JdbcTemplate jdbcTemplate;

    public AdminService(
            UserRepository userRepository,
            UserService userService,
            ListingRepository listingRepository,
            ApplicationRepository applicationRepository,
            ReportRepository reportRepository,
            ReportService reportService,
            VerificationCodeRepository verificationCodeRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            NotificationRepository notificationRepository,
            FavoriteRepository favoriteRepository,
            ReviewRepository reviewRepository,
            AuditLogRepository auditLogRepository,
            AuditLogService auditLogService,
            JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.listingRepository = listingRepository;
        this.applicationRepository = applicationRepository;
        this.reportRepository = reportRepository;
        this.reportService = reportService;
        this.verificationCodeRepository = verificationCodeRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
        this.favoriteRepository = favoriteRepository;
        this.reviewRepository = reviewRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogService = auditLogService;
        this.jdbcTemplate = jdbcTemplate;
    }

    // ---------------------------------------------------------------- Users

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(String role, String status, Boolean emailVerified, String search, Pageable pageable) {
        return userRepository.findAll(
                        UserSpecification.withFilters(role, status, emailVerified, search),
                        pageable)
                .map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public AdminUserDetailResponse getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        AdminUserDetailResponse dto = AdminUserDetailResponse.fromEntity(user);
        dto.setTotalListings(listingRepository.countByOwner(user));
        dto.setTotalApplications(applicationRepository.countByStudent(user));
        dto.setTotalFavorites(favoriteRepository.countByUser(user));
        dto.setTotalReviews(reviewRepository.countByAuthor(user));
        return dto;
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, String status, String reason, String actorEmail) {
        if (!UserStatus.isValid(status)) {
            throw new BadRequestException("Invalid user status: " + status + ". Allowed values: ACTIVE, SUSPENDED, DELETED, PENDING");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String previous = user.getStatus();
        String nextStatus = status.trim().toUpperCase();
        if (UserStatus.SUSPENDED.equals(nextStatus) && (reason == null || reason.trim().isEmpty())) {
            throw new BadRequestException("A suspension reason is required");
        }
        user.setStatus(nextStatus);
        user.setSuspensionReason(UserStatus.SUSPENDED.equals(nextStatus) ? reason.trim() : null);
        User saved = userRepository.save(user);

        User actor = resolveActor(actorEmail);
        String description = "Admin changed " + saved.getName() + "'s status from " + previous + " to " + saved.getStatus()
                + (saved.getSuspensionReason() != null ? ". Reason: " + saved.getSuspensionReason() : "");
        auditLogService.record(AuditActions.USER_STATUS_CHANGED, "USER", saved.getId(), description, actor, previous, saved.getStatus(), null);

        return UserResponse.fromEntity(saved);
    }

    // ------------------------------------------------------------- Listings

    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(ListingStatus status, String search, Pageable pageable) {
        return listingRepository.findAll(ListingSpecification.forAdmin(status, search), pageable)
                .map(ListingResponse::fromEntity);
    }

    @Transactional
    public ListingResponse updateListingStatus(Long listingId, ListingStatus status, String actorEmail) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        ListingStatus previous = listing.getStatus();
        listing.setStatus(status);
        Listing saved = listingRepository.save(listing);

        User actor = resolveActor(actorEmail);
        String description = "Listing \"" + saved.getTitle() + "\" status changed from " + previous + " to " + status;
        auditLogService.record(AuditActions.LISTING_STATUS_CHANGED, "LISTING", saved.getId(), description, actor,
                previous != null ? previous.name() : null, status.name(), null);

        return ListingResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteListing(Long listingId, String actorEmail) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        String title = listing.getTitle();
        listingRepository.delete(listing);

        User actor = resolveActor(actorEmail);
        auditLogService.record(AuditActions.LISTING_DELETED, "LISTING", listingId,
                "Admin deleted listing \"" + title + "\"", actor, null, null, null);
    }

    // ------------------------------------------------------------ Applications

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplications(ApplicationStatus status, String search, Pageable pageable) {
        if (status == null && (search == null || search.isBlank())) {
            return applicationRepository.findAll(pageable).map(ApplicationResponse::fromEntity);
        }
        return applicationRepository.findAll(applicationSpec(status, search), pageable)
                .map(ApplicationResponse::fromEntity);
    }

    private org.springframework.data.jpa.domain.Specification<Application> applicationSpec(ApplicationStatus status, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                var student = root.join("student");
                var listing = root.join("listing");
                predicates.add(cb.or(
                        cb.like(cb.lower(student.get("name")), like),
                        cb.like(cb.lower(student.get("email")), like),
                        cb.like(cb.lower(listing.get("title")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // ---------------------------------------------------------------- Reports

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReports(ReportStatus status, Pageable pageable) {
        return reportService.getAllReports(status, pageable);
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        return reportService.getReportById(reportId);
    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatus status, String actorEmail) {
        return reportService.updateReportStatus(reportId, status, resolveActor(actorEmail));
    }

    // ----------------------------------------------------------- Verifications

    @Transactional(readOnly = true)
    public Page<VerificationResponse> getVerifications(String email, String status, Pageable pageable) {
        return verificationCodeRepository.findAll(verificationSpec(email, status), pageable)
                .map(VerificationResponse::fromEntity);
    }

    private org.springframework.data.jpa.domain.Specification<VerificationCode> verificationSpec(String email, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (email != null && !email.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + email.trim().toLowerCase() + "%"));
            }
            if (status != null && !status.isBlank()) {
                LocalDateTime now = LocalDateTime.now();
                switch (status.trim().toUpperCase()) {
                    case "ACTIVE" -> predicates.add(cb.and(
                            cb.isFalse(root.get("verified")),
                            cb.greaterThan(root.get("expiresAt"), now)));
                    case "USED" -> predicates.add(cb.isTrue(root.get("verified")));
                    case "EXPIRED" -> predicates.add(cb.and(
                            cb.isFalse(root.get("verified")),
                            cb.lessThanOrEqualTo(root.get("expiresAt"), now)));
                    default -> throw new BadRequestException("Invalid verification status: " + status
                            + ". Allowed values: ACTIVE, USED, EXPIRED");
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // ---------------------------------------------------------- Conversations

    @Transactional(readOnly = true)
    public Page<AdminConversationResponse> getConversations(Pageable pageable) {
        Map<Long, Long> countsByConversation = new HashMap<>();
        for (Object[] row : messageRepository.countMessagesGroupedByConversation()) {
            countsByConversation.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return conversationRepository.findAll(pageable)
                .map(conversation -> AdminConversationResponse.fromEntity(
                        conversation,
                        countsByConversation.getOrDefault(conversation.getId(), 0L)));
    }

    // ---------------------------------------------------------- Notifications

    @Transactional(readOnly = true)
    public Page<AdminNotificationResponse> getNotifications(NotificationType type, Boolean read, String search, Pageable pageable) {
        return notificationRepository.findAll(NotificationSpecification.withFilters(type, read, search), pageable)
                .map(AdminNotificationResponse::fromEntity);
    }

    // --------------------------------------------------------------- Activity

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getActivity(
            String action,
            String entityType,
            Long actorUserId,
            String search,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable) {
        return auditLogRepository.findAll(
                        AuditLogSpecification.withFilters(action, entityType, actorUserId, search, from, to),
                        pageable)
                .map(AuditLogResponse::fromEntity);
    }

    // ------------------------------------------------------------------ Stats

    @Transactional(readOnly = true)
    public AdminStatsResponse getPlatformStats() {
        AdminStatsResponse s = new AdminStatsResponse();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dayAgo = now.minus(1, ChronoUnit.DAYS);
        LocalDateTime weekAgo = now.minus(7, ChronoUnit.DAYS);

        s.setTotalUsers(userRepository.count());
        s.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        s.setTotalOwners(userRepository.countByRole(Role.OWNER));
        s.setTotalAdmins(userRepository.countByRole(Role.ADMIN));
        s.setActiveUsers(userRepository.countByStatus(UserStatus.ACTIVE));
        s.setSuspendedUsers(userRepository.countByStatus(UserStatus.SUSPENDED));
        s.setVerifiedUsers(userRepository.countByEmailVerified(true));
        s.setUnverifiedUsers(userRepository.countByEmailVerified(false));
        s.setNewUsersLast7Days(userRepository.countByCreatedAtAfter(weekAgo));
        s.setNewUsersToday(userRepository.countByCreatedAtAfter(dayAgo));

        s.setTotalListings(listingRepository.count());
        s.setActiveListings(listingRepository.countByStatus(ListingStatus.ACTIVE));
        s.setPendingListings(listingRepository.countByStatus(ListingStatus.PENDING_REVIEW));
        s.setRejectedListings(listingRepository.countByStatus(ListingStatus.REJECTED));
        s.setSuspendedListings(listingRepository.countByStatus(ListingStatus.SUSPENDED));

        s.setTotalApplications(applicationRepository.count());
        s.setPendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING));
        s.setAcceptedApplications(applicationRepository.countByStatus(ApplicationStatus.ACCEPTED));
        s.setRejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED));

        s.setTotalReports(reportRepository.count());
        s.setPendingReports(reportRepository.countByStatus(ReportStatus.PENDING));
        s.setReviewingReports(reportRepository.countByStatus(ReportStatus.REVIEWING));
        s.setResolvedReports(reportRepository.countByStatus(ReportStatus.RESOLVED));

        s.setTotalConversations(conversationRepository.count());
        s.setTotalMessages(messageRepository.count());
        s.setTotalNotifications(notificationRepository.count());
        s.setTotalFavorites(favoriteRepository.count());
        s.setTotalReviews(reviewRepository.count());

        s.setEventsLast24Hours(auditLogRepository.count(
                (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), dayAgo)));
        s.setEventsLast7Days(auditLogRepository.count(
                (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), weekAgo)));

        return s;
    }

    // ------------------------------------------------------- System overview

    @Transactional(readOnly = true)
    public SystemOverviewResponse getSystemOverview() {
        SystemOverviewResponse response = new SystemOverviewResponse();
        response.setService("RoomRoot Backend");
        response.setStatus("UP");
        response.setApiVersion("v1");
        response.setJavaVersion(System.getProperty("java.version"));

        String appVersion = RoomRootVersion.get();
        response.setApplicationVersion(appVersion);
        response.setServerTime(LocalDateTime.now());

        try {
            Integer one = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            response.setDatabaseStatus(Objects.equals(one, 1) ? "UP" : "DOWN");
        } catch (Exception e) {
            response.setDatabaseStatus("DOWN");
        }

        Map<String, Long> counts = new LinkedHashMap<>();
        counts.put("Users", userRepository.count());
        counts.put("Listings", listingRepository.count());
        counts.put("Applications", applicationRepository.count());
        counts.put("Verification Codes", verificationCodeRepository.count());
        counts.put("Conversations", conversationRepository.count());
        counts.put("Messages", messageRepository.count());
        counts.put("Notifications", notificationRepository.count());
        counts.put("Favorites", favoriteRepository.count());
        counts.put("Reviews", reviewRepository.count());
        counts.put("Reports", reportRepository.count());
        counts.put("Audit Log Entries", auditLogRepository.count());
        response.setRecordCounts(counts);

        return response;
    }

    // -------------------------------------------------------------- Internal

    private User resolveActor(String actorEmail) {
        if (actorEmail == null || actorEmail.isBlank()) {
            return null;
        }
        return userService.findByEmailOrThrow(actorEmail);
    }
}
