package com.roomroot.backend.api;

import com.roomroot.backend.common.ApiResponse;
import com.roomroot.backend.user.UserService;
import com.roomroot.backend.user.dto.UpdateUserRequest;
import com.roomroot.backend.user.dto.UserResponse;
import com.roomroot.backend.user.dto.SubmitAppealRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User profile and account management endpoints")
public class UserController {

    private final UserService userService;
    private final com.roomroot.backend.user.UserAccountService userAccountService;

    public UserController(UserService userService, com.roomroot.backend.user.UserAccountService userAccountService) {
        this.userService = userService;
        this.userAccountService = userAccountService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", response));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUserProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", response));
    }

    @PostMapping("/me/appeal")
    @Operation(summary = "Submit a suspension appeal for administrator review")
    public ResponseEntity<ApiResponse<Void>> submitAppeal(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitAppealRequest request) {
        userService.submitSuspensionAppeal(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Your appeal has been sent for review"));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Permanently delete the current account and its data")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentAccount(@AuthenticationPrincipal UserDetails userDetails) {
        userAccountService.permanentlyDelete(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Account permanently deleted"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get public user profile by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User found", response));
    }
}
