package com.ktts.lecture.security;

import java.util.UUID;

import com.ktts.lecture.domain.AppUser;
import com.ktts.lecture.domain.Role;

/** The authenticated principal placed in the SecurityContext for each request. */
public record AuthUser(UUID id, String email, Role role) {

    public static AuthUser of(AppUser user) {
        return new AuthUser(user.getId(), user.getEmail(), user.getRole());
    }
}
