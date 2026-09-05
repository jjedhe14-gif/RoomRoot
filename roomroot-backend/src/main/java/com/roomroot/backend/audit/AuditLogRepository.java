package com.roomroot.backend.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {
    @Modifying
    @Query("DELETE FROM AuditLog a WHERE a.actorUserId = :userId OR (a.entityType = 'USER' AND a.entityId = :userId)")
    void deleteAllForUser(@Param("userId") Long userId);
}
