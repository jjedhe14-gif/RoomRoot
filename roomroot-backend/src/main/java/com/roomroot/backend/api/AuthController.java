package com.roomroot.backend.api;

import com.roomroot.backend.auth.AuthResponse;
import com.roomroot.backend.auth.SendCodeRequest;
import com.roomroot.backend.auth.VerifyCodeRequest;
import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for passwordless email verification and login")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-code")
    @Operation(summary = "Send 6-digit verification code to email")
    public ResponseEntity<ApiResponse<Void>> sendCode(
            @RequestParam(required = false) String email,
            @RequestBody(required = false) SendCodeRequest request) {

        String targetEmail = (request != null && request.getEmail() != null)
                ? request.getEmail()
                : email;

        if (targetEmail == null || targetEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email is required", "MISSING_EMAIL"));
        }

        authService.generateVerificationCode(targetEmail);

        return ResponseEntity.ok(
                ApiResponse.success("Verification code sent successfully")
        );
    }

    @PostMapping("/verify-code")
    @Operation(summary = "Verify 6-digit code and obtain JWT authentication token")
    public ResponseEntity<AuthResponse> verifyCode(
            @Valid @RequestBody VerifyCodeRequest request) {

        AuthResponse authResponse = authService.verifyCodeAndCreateToken(
                request.getEmail(),
                request.getCode(),
                request.getName()
        );

        return ResponseEntity.ok(authResponse);
    }
}