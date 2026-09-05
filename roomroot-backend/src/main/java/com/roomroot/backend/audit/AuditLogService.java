package com.roomroot.backend.audit;

import com.roomroot.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Records and queries platform audit events.
 *
 * <p>Recording runs in its own transaction ({@code REQUIRES_NEW}) so an audit
 * entry survives even when the business operation that triggered it rolls back -
 * important for security-relevant events such as failed moderation or status
 * changes. Pure read methods are read-only transactions.
 */
@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, String entityType, Long entityId, String description, User actor) {
        record(action, entityType, entityId, description, actor, null, null, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, String entityType, Long entityId, String description,
                       User actor, String oldValue, String newValue, String metadata) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setMetadata(metadata);
        if (actor != null) {
            log.setActorUserId(actor.getId());
            log.setActorName(actor.getName());
            log.setActorEmail(actor.getEmail());
        }
        auditLogRepository.save(log);
    }

    public long countLogsSince(LocalDateTime since) {
        return auditLogRepository.count(
                (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), since));
    }
}
