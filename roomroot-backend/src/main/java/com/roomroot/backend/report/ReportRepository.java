package com.roomroot.backend.report;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByReporter(User reporter, Pageable pageable);

    Page<Report> findByStatus(ReportStatus status, Pageable pageable);

    long countByStatus(ReportStatus status);
    @Modifying @Query("DELETE FROM Report r WHERE r.reporter = :user OR r.listing.id IN "
            + "(SELECT l.id FROM Listing l WHERE l.owner = :user)")
    void deleteAllCreatedByOrAboutListingsOf(@Param("user") User user);
    @Modifying @Query("UPDATE Report r SET r.reportedUser = null WHERE r.reportedUser = :user")
    void anonymizeReportedUser(@Param("user") User user);
}
