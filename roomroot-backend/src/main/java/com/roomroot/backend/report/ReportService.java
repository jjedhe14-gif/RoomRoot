package com.roomroot.backend.report;

import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.exception.ResourceNotFoundException;
import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.listing.ListingService;
import com.roomroot.backend.report.dto.ReportRequest;
import com.roomroot.backend.report.dto.ReportResponse;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserRepository;
import com.roomroot.backend.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ListingService listingService;
    private final AuditLogService auditLogService;

    public ReportService(
            ReportRepository reportRepository,
            UserService userService,
            UserRepository userRepository,
            ListingService listingService,
            AuditLogService auditLogService) {
        this.reportRepository = reportRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.listingService = listingService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ReportResponse createReport(String reporterEmail, ReportRequest request) {
        User reporter = userService.findByEmailOrThrow(reporterEmail);

        if (request.getListingId() == null && request.getReportedUserId() == null && (request.getTargetName() == null || request.getTargetName().isBlank())) {
            throw new BadRequestException("Report must target either a listing or a user");
        }

        User reportedUser = null;
        if (request.getReportedUserId() != null) {
            reportedUser = userRepository.findById(request.getReportedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reported user not found with id: " + request.getReportedUserId()));
        }

        Listing listing = null;
        if (request.getListingId() != null) {
            listing = listingService.findEntityById(request.getListingId());
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setListing(listing);
        report.setReason(request.getReason().trim());
        report.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        report.setTargetName(request.getTargetName() != null ? request.getTargetName().trim() : null);
        report.setTargetAddress(request.getTargetAddress() != null ? request.getTargetAddress().trim() : null);
        report.setStatus(ReportStatus.PENDING);

        Report saved = reportRepository.save(report);

        String target = listing != null
                ? "listing \"" + listing.getTitle() + "\""
            : reportedUser != null ? "user " + reportedUser.getName() : "listing \"" + request.getTargetName() + "\"";
        auditLogService.record(AuditActions.REPORT_CREATED, "REPORT", saved.getId(),
                reporter.getName() + " reported " + target + " (" + saved.getReason() + ")", reporter);

        return ReportResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getMyReports(String reporterEmail, Pageable pageable) {
        User reporter = userService.findByEmailOrThrow(reporterEmail);
        return reportRepository.findByReporter(reporter, pageable)
                .map(ReportResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getAllReports(ReportStatus status, Pageable pageable) {
        if (status != null) {
            return reportRepository.findByStatus(status, pageable)
                    .map(ReportResponse::fromEntity);
        }
        return reportRepository.findAll(pageable)
                .map(ReportResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        return ReportResponse.fromEntity(report);
    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatus status) {
        return updateReportStatus(reportId, status, null);
    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, ReportStatus status, User actor) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        ReportStatus previous = report.getStatus();
        report.setStatus(status);
        Report updated = reportRepository.save(report);

        auditLogService.record(AuditActions.REPORT_STATUS_CHANGED, "REPORT", updated.getId(),
                "Report #" + updated.getId() + " status changed from " + previous + " to " + status,
                actor, previous.name(), status.name(), null);

        return ReportResponse.fromEntity(updated);
    }
}
