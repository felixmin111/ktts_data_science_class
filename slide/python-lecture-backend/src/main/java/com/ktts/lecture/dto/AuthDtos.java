package com.ktts.lecture.dto;

import java.time.Instant;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.ktts.lecture.domain.AppUser;
import com.ktts.lecture.domain.Role;

public final class AuthDtos {

    /** 8–72 characters with at least one letter and one digit (BCrypt only reads 72 bytes). */
    public static final String PASSWORD_PATTERN = "^(?=.*\\p{L})(?=.*\\p{Nd}).{8,72}$";

    private AuthDtos() {}

    public record RegisterRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Pattern(regexp = PASSWORD_PATTERN) String password,
            @NotBlank @Size(max = 60) String displayName) {}

    public record LoginRequest(
            @NotBlank @Size(max = 254) String email,
            @NotBlank @Size(max = 200) String password) {}

    public record UserResponse(UUID id, String email, String displayName, Role role, Instant createdAt) {

        public static UserResponse of(AppUser user) {
            return new UserResponse(
                    user.getId(), user.getEmail(), user.getDisplayName(), user.getRole(), user.getCreatedAt());
        }
    }

    public record AuthResponse(String accessToken, long expiresInSeconds, UserResponse user) {}
}
