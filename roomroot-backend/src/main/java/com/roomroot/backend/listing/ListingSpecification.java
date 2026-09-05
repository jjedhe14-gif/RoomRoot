package com.roomroot.backend.listing;

import com.roomroot.backend.listing.dto.ListingSearchCriteria;
import com.roomroot.backend.user.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ListingSpecification {

    /**
     * Admin moderation filter: optional status plus a free-text search across
     * title, city, locality and owner name/email. Unlike {@link #withCriteria},
     * this does not restrict results to ACTIVE listings.
     */
    public static Specification<Listing> forAdmin(ListingStatus status, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                Join<Listing, User> owner = root.join("owner");
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("city")), like),
                        cb.like(cb.lower(root.get("locality")), like),
                        cb.like(cb.lower(owner.get("name")), like),
                        cb.like(cb.lower(owner.get("email")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Listing> withCriteria(ListingSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only ACTIVE listings for public searches
            predicates.add(cb.equal(root.get("status"), ListingStatus.ACTIVE));

            if (criteria.getCity() != null && !criteria.getCity().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + criteria.getCity().trim().toLowerCase() + "%"));
            }

            if (criteria.getLocality() != null && !criteria.getLocality().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("locality")), "%" + criteria.getLocality().trim().toLowerCase() + "%"));
            }

            if (criteria.getMinRent() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("monthlyRent"), criteria.getMinRent()));
            }

            if (criteria.getMaxRent() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("monthlyRent"), criteria.getMaxRent()));
            }

            if (criteria.getRoomType() != null) {
                predicates.add(cb.equal(root.get("roomType"), criteria.getRoomType()));
            }

            if (criteria.getFurnished() != null) {
                predicates.add(cb.equal(root.get("furnished"), criteria.getFurnished()));
            }

            if (criteria.getBathroomType() != null) {
                predicates.add(cb.equal(root.get("bathroomType"), criteria.getBathroomType()));
            }

            if (criteria.getGenderPreference() != null) {
                predicates.add(cb.equal(root.get("genderPreference"), criteria.getGenderPreference()));
            }

            if (criteria.getAvailable() != null) {
                predicates.add(cb.equal(root.get("available"), criteria.getAvailable()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
