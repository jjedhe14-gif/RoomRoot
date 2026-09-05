package com.roomroot.backend.user;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> withFilters(String role, String status, Boolean emailVerified, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null && !role.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("role")), role.trim().toLowerCase()));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            if (emailVerified != null) {
                predicates.add(cb.equal(root.get("emailVerified"), emailVerified));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("university")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
