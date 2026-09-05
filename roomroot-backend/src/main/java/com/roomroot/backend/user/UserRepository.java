package com.roomroot.backend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(String role, Pageable pageable);

    Page<User> findByStatus(String status, Pageable pageable);

    long countByRole(String role);

    long countByStatus(String status);

    long countByEmailVerified(boolean emailVerified);

    long countByCreatedAtAfter(LocalDateTime createdAt);
}
