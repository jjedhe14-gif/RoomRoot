package com.roomroot.backend.listing;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);

    Page<Listing> findByOwner(User owner, Pageable pageable);

    long countByStatus(ListingStatus status);

    long countByOwner(User owner);

    List<Listing> findAllByOwner(User owner);
}
