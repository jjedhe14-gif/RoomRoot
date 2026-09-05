package com.roomroot.backend.application;

import com.roomroot.backend.application.dto.ApplicationRequest;
import com.roomroot.backend.application.dto.ApplicationResponse;
import com.roomroot.backend.application.dto.UpdateApplicationStatusRequest;
import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.exception.ConflictException;
import com.roomroot.backend.exception.ForbiddenException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.notification.NotificationService;
import com.roomroot.backend.notification.NotificationType;
import com.roomroot.backend.user.Role;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ListingService listingService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ListingService listingService,
            UserService userService,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.applicationRepository = applicationRepository;
        this.listingService = listingService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ApplicationResponse submitApplication(Long listingId, String studentEmail, ApplicationRequest request) {
        User student = userService.findByEmailOrThrow(studentEmail);
        Listing listing = listingService.findEntityById(listingId);

        if (listing.getOwner().getId().equals(student.getId())) {
            throw new BadRequestException("You cannot apply to your own listing");
        }

        boolean alreadyApplied = applicationRepository.existsByStudentAndListingAndStatusIn(
                student,
                listing,
                List.of(ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED)
        );
        if (alreadyApplied) {
            throw new ConflictException("You already have an active application for this listing");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setListing(listing);
        application.setMessage(request != null ? request.getMessage() : null);
        application.setStatus(ApplicationStatus.PENDING);

        Application saved = applicationRepository.save(application);

        // Notify property owner
        notificationService.createNotification(
                listing.getOwner(),
                "New Application for " + listing.getTitle(),
                student.getName() + " has applied for your listing.",
                NotificationType.APPLICATION
        );

        auditLogService.record(AuditActions.APPLICATION_CREATED, "APPLICATION", saved.getId(),
                student.getName() + " applied to listing \"" + listing.getTitle() + "\"", student);

        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getStudentApplications(String studentEmail, Pageable pageable) {
        User student = userService.findByEmailOrThrow(studentEmail);
        return applicationRepository.findByStudent(student, pageable)
                .map(ApplicationResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getListingApplications(Long listingId, String ownerEmail, Pageable pageable) {
        User user = userService.findByEmailOrThrow(ownerEmail);
        Listing listing = listingService.findEntityById(listingId);

        if (!listing.getOwner().getId().equals(user.getId()) && !Role.ADMIN.equalsIgnoreCase(user.getRole())) {
            throw new ForbiddenException("Only the listing owner can view its applications");
        }

        return applicationRepository.findByListing(listing, pageable)
                .map(ApplicationResponse::fromEntity);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            String userEmail,
            UpdateApplicationStatusRequest request) {

        User user = userService.findByEmailOrThrow(userEmail);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        ApplicationStatus targetStatus = request.getStatus();

        if (targetStatus == ApplicationStatus.WITHDRAWN) {
            // Student withdraws
            if (!application.getStudent().getId().equals(user.getId())) {
                throw new ForbiddenException("Only the applicant student can withdraw their application");
            }
        } else if (targetStatus == ApplicationStatus.ACCEPTED || targetStatus == ApplicationStatus.REJECTED) {
            // Owner decides
            if (!application.getListing().getOwner().getId().equals(user.getId()) && !Role.ADMIN.equalsIgnoreCase(user.getRole())) {
                throw new ForbiddenException("Only the listing owner can accept or reject this application");
            }
        } else {
            throw new BadRequestException("Invalid status transition to " + targetStatus);
        }

        ApplicationStatus previous = application.getStatus();
        application.setStatus(targetStatus);
        Application updated = applicationRepository.save(application);

        auditLogService.record(AuditActions.APPLICATION_STATUS_CHANGED, "APPLICATION", updated.getId(),
                "Application #" + updated.getId() + " for \"" + updated.getListing().getTitle()
                        + "\" changed from " + previous + " to " + targetStatus,
                user, previous.name(), targetStatus.name(), null);

        // Notify student about outcome
        if (targetStatus == ApplicationStatus.ACCEPTED) {
            notificationService.createNotification(
                    application.getStudent(),
                    "Application Accepted!",
                    "Your application for " + application.getListing().getTitle() + " has been accepted by the owner.",
                    NotificationType.APPLICATION_ACCEPTED
            );
        } else if (targetStatus == ApplicationStatus.REJECTED) {
            notificationService.createNotification(
                    application.getStudent(),
                    "Application Update",
                    "Your application for " + application.getListing().getTitle() + " was not accepted.",
                    NotificationType.APPLICATION_REJECTED
            );
        }

        return ApplicationResponse.fromEntity(updated);
    }
}
