package com.roomroot.backend.message;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE (c.participant1 = :u1 AND c.participant2 = :u2) OR (c.participant1 = :u2 AND c.participant2 = :u1)")
    Optional<Conversation> findBetweenUsers(@Param("u1") User u1, @Param("u2") User u2);

    @Query("SELECT c FROM Conversation c WHERE c.participant1 = :user OR c.participant2 = :user ORDER BY c.updatedAt DESC")
    Page<Conversation> findByUser(@Param("user") User user, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Conversation c WHERE c.participant1 = :user OR c.participant2 = :user")
    void deleteAllForUser(@Param("user") User user);
}
