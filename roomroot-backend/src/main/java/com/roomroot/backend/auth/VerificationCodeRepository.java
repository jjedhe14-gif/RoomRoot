package com.roomroot.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long>, JpaSpecificationExecutor<VerificationCode> {

    Optional<VerificationCode> findTopByEmailOrderByCreatedAtDesc(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM VerificationCode v WHERE v.email = :email")
    void deleteByEmail(@Param("email") String email);

    long countByEmailAndCreatedAtAfter(String email, LocalDateTime after);
}