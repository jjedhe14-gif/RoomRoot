package com.roomroot.backend.notification;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class NotificationSpecification {

    private NotificationSpecification() {
    }

    public static Specification<Notification> withFilters(NotificationType type, Boolean read, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (read != null) {
                predicates.add(cb.equal(root.get("read"), read));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), like));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
