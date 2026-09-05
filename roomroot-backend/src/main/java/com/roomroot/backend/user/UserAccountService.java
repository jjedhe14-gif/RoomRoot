package com.roomroot.backend.user;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Permanently erases an account and the platform data created by it. */
@Service
public class UserAccountService {
    private final UserRepository users;
    @PersistenceContext
    private EntityManager entityManager;

    public UserAccountService(UserRepository users) {
        this.users = users;
    }

    @Transactional
    public void permanentlyDelete(String email) {
        User user = users.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new com.roomroot.backend.exception.ResourceNotFoundException("User not found"));

        long id = user.getId();
        // Native statements avoid ORM join-delete differences between MySQL versions.
        // The order respects every foreign key before the user row is removed.
        execute("DELETE FROM messages WHERE sender_id = :id OR conversation_id IN "
                + "(SELECT id FROM conversations WHERE participant1_id = :id OR participant2_id = :id)", id);
        execute("DELETE FROM conversations WHERE participant1_id = :id OR participant2_id = :id", id);
        execute("DELETE FROM notifications WHERE user_id = :id", id);
        execute("DELETE FROM service_requests WHERE user_id = :id", id);
        execute("DELETE FROM favorites WHERE user_id = :id OR listing_id IN "
                + "(SELECT id FROM listings WHERE owner_id = :id)", id);
        execute("DELETE FROM reviews WHERE author_id = :id OR listing_id IN "
                + "(SELECT id FROM listings WHERE owner_id = :id)", id);
        execute("DELETE FROM applications WHERE student_id = :id OR listing_id IN "
                + "(SELECT id FROM listings WHERE owner_id = :id)", id);
        execute("DELETE FROM reports WHERE reporter_id = :id OR listing_id IN "
                + "(SELECT id FROM listings WHERE owner_id = :id)", id);
        execute("UPDATE reports SET reported_user_id = NULL WHERE reported_user_id = :id", id);
        execute("DELETE FROM listing_images WHERE listing_id IN (SELECT id FROM listings WHERE owner_id = :id)", id);
        execute("DELETE FROM listings WHERE owner_id = :id", id);
        entityManager.createNativeQuery("DELETE FROM verification_codes WHERE email = :email")
                .setParameter("email", user.getEmail()).executeUpdate();
        execute("DELETE FROM audit_logs WHERE actor_user_id = :id OR (entity_type = 'USER' AND entity_id = :id)", id);
        execute("DELETE FROM users WHERE id = :id", id);
    }

    private void execute(String sql, long id) {
        entityManager.createNativeQuery(sql).setParameter("id", id).executeUpdate();
    }
}
