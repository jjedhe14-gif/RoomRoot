package com.roomroot.backend.favorite;

import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserAndListing(User user, Listing listing);

    Optional<Favorite> findByUserAndListing(User user, Listing listing);

    Page<Favorite> findByUser(User user, Pageable pageable);

    @Modifying
    @Transactional
    @Query("DELETE FROM Favorite f WHERE f.user = :user AND f.listing = :listing")
    void deleteByUserAndListing(@Param("user") User user, @Param("listing") Listing listing);

    long countByUser(User user);

    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.user = :user OR f.listing.id IN "
            + "(SELECT l.id FROM Listing l WHERE l.owner = :user)")
    void deleteAllRelatedToUser(@Param("user") User user);
}
