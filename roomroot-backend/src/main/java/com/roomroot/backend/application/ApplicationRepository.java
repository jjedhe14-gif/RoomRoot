package com.roomroot.backend.application;

import com.roomroot.backend.listing.Listing;
import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {

    Page<Application> findByStudent(User student, Pageable pageable);

    Page<Application> findByListing(Listing listing, Pageable pageable);

    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);

    boolean existsByStudentAndListingAndStatusIn(User student, Listing listing, Collection<ApplicationStatus> statuses);

    long countByStatus(ApplicationStatus status);

    long countByStudent(User student);
    @Modifying @Query("DELETE FROM Application a WHERE a.student = :user OR a.listing.id IN "
            + "(SELECT l.id FROM Listing l WHERE l.owner = :user)")
    void deleteAllRelatedToUser(@Param("user") User user);
}
