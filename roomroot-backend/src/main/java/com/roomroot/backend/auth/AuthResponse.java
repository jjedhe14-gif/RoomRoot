package com.roomroot.backend.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.roomroot.backend.user.dto.UserResponse;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String token, UserResponse user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
