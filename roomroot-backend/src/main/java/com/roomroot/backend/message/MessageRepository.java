package com.roomroot.backend.message;

import com.roomroot.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation, Pageable pageable);

    Optional<Message> findTopByConversationOrderByCreatedAtDesc(Conversation conversation);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.readAt = :now WHERE m.conversation = :conv AND m.sender <> :user AND m.readAt IS NULL")
    int markConversationMessagesAsRead(@Param("conv") Conversation conv, @Param("user") User user, @Param("now") LocalDateTime now);

    @Query("SELECT m.conversation.id AS conversationId, COUNT(m) AS messageCount FROM Message m GROUP BY m.conversation.id")
    List<Object[]> countMessagesGroupedByConversation();

    @Modifying
    @Query("DELETE FROM Message m WHERE m.sender = :user OR m.conversation.id IN "
            + "(SELECT c.id FROM Conversation c WHERE c.participant1 = :user OR c.participant2 = :user)")
    void deleteAllRelatedToUser(@Param("user") User user);
}
