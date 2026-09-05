package com.roomroot.backend.notification;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    long countByUserAndReadFalse(User user);

    long countByUser(User user);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user AND n.read = false")
    int markAllAsReadForUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user = :user")
    void deleteAllForUser(@Param("user") User user);
}
