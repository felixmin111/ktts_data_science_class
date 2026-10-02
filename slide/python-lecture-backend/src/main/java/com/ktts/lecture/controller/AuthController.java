package com.ktts.lecture.controller;

import java.time.Duration;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.dto.AuthDtos.AuthResponse;
import com.ktts.lecture.dto.AuthDtos.LoginRequest;
import com.ktts.lecture.dto.AuthDtos.RegisterRequest;
import com.ktts.lecture.dto.AuthDtos.UserResponse;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.security.JwtService;
import com.ktts.lecture.security.RefreshTokenService;
import com.ktts.lecture.service.AuthService;
import com.ktts.lecture.service.AuthService.Session;

import lombok.RequiredArgsConstructor;

/**
 * The access token is returned in the body (the frontend keeps it in memory only). The refresh token
 * goes in an httpOnly, SameSite=Strict cookie scoped to /api/v1/auth, so page scripts can never read it.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    public static final String REFRESH_COOKIE = "pl_refresh";
    private static final String COOKIE_PATH = "/api/v1/auth";
    /** Custom header that cross-site forms cannot send: extra CSRF protection for cookie endpoints. */
    private static final String CSRF_HEADER = "X-Requested-With";

    private final AuthService authService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AppProperties appProperties;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        return respond(authService.register(request), response);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        return respond(authService.login(request), response);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken,
            @RequestHeader(name = CSRF_HEADER, required = false) String csrfHeader,
            HttpServletResponse response) {
        requireCsrfHeader(csrfHeader);
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        try {
            return respond(authService.refresh(refreshToken), response);
        } catch (ApiException e) {
            response.addHeader(HttpHeaders.SET_COOKIE, cookie("", Duration.ZERO));
            throw e;
        }
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken,
            @RequestHeader(name = CSRF_HEADER, required = false) String csrfHeader,
            HttpServletResponse response) {
        requireCsrfHeader(csrfHeader);
        authService.logout(refreshToken);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie("", Duration.ZERO));
    }

    private AuthResponse respond(Session session, HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, cookie(session.refreshToken(), refreshTokenService.ttl()));
        response.addHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        return new AuthResponse(
                session.accessToken(), jwtService.accessTokenTtl().toSeconds(), UserResponse.of(session.user()));
    }

    private String cookie(String value, Duration maxAge) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(appProperties.cookie().secure())
                .sameSite("Strict")
                .path(COOKIE_PATH)
                .maxAge(maxAge)
                .build()
                .toString();
    }

    private static void requireCsrfHeader(String value) {
        if (value == null || value.isBlank()) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
    }
}
