package com.roomroot.backend.service;

import com.roomroot.backend.auth.VerificationCode;
import com.roomroot.backend.auth.VerificationCodeRepository;
import com.roomroot.backend.auth.AuthResponse;
import com.roomroot.backend.audit.AuditActions;
import com.roomroot.backend.audit.AuditLogService;
import com.roomroot.backend.security.JwtService;
import com.roomroot.backend.exception.BadRequestException;
import com.roomroot.backend.user.User;
import com.roomroot.backend.user.UserRepository;
import com.roomroot.backend.user.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final EmailService emailService;
        private final Set<String> adminEmails;

    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            VerificationCodeRepository verificationCodeRepository,
            UserRepository userRepository,
            JwtService jwtService,
            AuditLogService auditLogService,
            EmailService emailService,
            @Value("${roomroot.admin.emails:}") String adminEmails) {

        this.verificationCodeRepository = verificationCodeRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
        this.adminEmails = Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    @Transactional
    public void generateVerificationCode(String email) {

        email = email.trim().toLowerCase();

        verificationCodeRepository.deleteByEmail(email);

        String code = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        LocalDateTime now = LocalDateTime.now();

        VerificationCode verificationCode = new VerificationCode();

        verificationCode.setEmail(email);
        verificationCode.setCode(code);
        verificationCode.setCreatedAt(now);
        verificationCode.setExpiresAt(now.plusMinutes(5));
        verificationCode.setVerified(false);

        verificationCodeRepository.save(verificationCode);

        // Send OTP to the USER's email address (not to admin)
        emailService.sendOtpEmail(email, code);

        auditLogService.record(AuditActions.OTP_REQUESTED, "VERIFICATION", verificationCode.getId(),
                "Verification code requested for " + email, null, null, null, null);
    }

    @Transactional
    public User verifyCode(String email, String code, String name) {

        email = email.trim().toLowerCase();
        code = code.trim();

        VerificationCode verificationCode =
                verificationCodeRepository
                        .findTopByEmailOrderByCreatedAtDesc(email)
                        .orElseThrow(() -> new BadRequestException("No verification code found"));

        if (verificationCode.isVerified()) {
                throw new BadRequestException("Verification code already been used");
        }

        if (LocalDateTime.now()
                .isAfter(verificationCode.getExpiresAt())) {

                throw new BadRequestException("Verification code expired");
        }

        if (!verificationCode.getCode().equals(code)) {

                throw new BadRequestException("Invalid verification code");
        }

        verificationCode.setVerified(true);
        verificationCode.setUsedAt(LocalDateTime.now());
        verificationCodeRepository.save(verificationCode);

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        // Existing user
        if (user != null) {
            boolean wasVerified = user.isEmailVerified();

            user.setEmailVerified(true);
                        if (isAdminEmail(email)) {
                                user.setRole("ADMIN");
                        }

            User saved = userRepository.save(user);

            auditLogService.record(AuditActions.OTP_VERIFIED, "VERIFICATION", verificationCode.getId(),
                    "Email verification completed for " + email, saved);
            if (!wasVerified) {
                auditLogService.record(AuditActions.USER_VERIFIED, "USER", saved.getId(),
                        saved.getName() + " verified their email", saved);
            }

            return saved;
        }

        // New user
        user = new User();

        user.setEmail(email);

        if (name == null || name.trim().isEmpty()) {
            user.setName("RoomRoot devs");
        } else {
            user.setName(name.trim());
        }

        user.setRole(isAdminEmail(email) ? "ADMIN" : "STUDENT");
        user.setEmailVerified(true);
        user.setStatus("ACTIVE");

        User created = userRepository.save(user);

        auditLogService.record(AuditActions.OTP_VERIFIED, "VERIFICATION", verificationCode.getId(),
                "Email verification completed for " + email, created);
        auditLogService.record(AuditActions.USER_REGISTERED, "USER", created.getId(),
                created.getName() + " created an account", created);

        return created;
    }

        private boolean isAdminEmail(String email) {
                return adminEmails.contains(email);
        }

    @Transactional
    public AuthResponse verifyCodeAndCreateToken(String email, String code, String name) {
        User user = verifyCode(email, code, name);
        return new AuthResponse(true, "Authentication successful", jwtService.generateToken(user), UserResponse.fromEntity(user));
    }
}