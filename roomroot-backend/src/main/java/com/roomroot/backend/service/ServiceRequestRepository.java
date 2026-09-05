package com.roomroot.backend.service;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Page<ServiceRequest> findByUser(User user, Pageable pageable);
    Page<ServiceRequest> findByStatus(ServiceRequestStatus status, Pageable pageable);
    @Modifying @Query("DELETE FROM ServiceRequest s WHERE s.user = :user")
    void deleteAllForUser(@Param("user") User user);
}
