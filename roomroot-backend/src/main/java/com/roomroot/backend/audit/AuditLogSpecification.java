package com.roomroot.backend.audit;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class AuditLogSpecification {

    private AuditLogSpecification() {
    }

    public static Specification<AuditLog> withFilters(
            String action,
            String entityType,
            Long actorUserId,
            String search,
            LocalDateTime from,
            LocalDateTime to) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (action != null && !action.isBlank()) {
                predicates.add(cb.equal(root.get("action"), action.trim().toUpperCase()));
            }
            if (entityType != null && !entityType.isBlank()) {
                predicates.add(cb.equal(root.get("entityType"), entityType.trim().toUpperCase()));
            }
            if (actorUserId != null) {
                predicates.add(cb.equal(root.get("actorUserId"), actorUserId));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("actorName")), like),
                        cb.like(cb.lower(root.get("actorEmail")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
