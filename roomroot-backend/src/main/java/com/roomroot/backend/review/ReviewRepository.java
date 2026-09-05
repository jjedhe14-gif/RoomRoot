package com.roomroot.backend.review;

import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAuthorAndListing(User author, Listing listing);

    Page<Review> findByListingOrderByCreatedAtDesc(Listing listing, Pageable pageable);

    long countByAuthor(User author);
    @Modifying @Query("DELETE FROM Review r WHERE r.author = :user OR r.listing.id IN "
            + "(SELECT l.id FROM Listing l WHERE l.owner = :user)")
    void deleteAllRelatedToUser(@Param("user") User user);
}
