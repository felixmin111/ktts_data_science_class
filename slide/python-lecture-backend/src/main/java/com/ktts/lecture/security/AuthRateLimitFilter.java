package com.ktts.lecture.security;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.jspecify.annotations.NonNull;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ktts.lecture.exception.ApiErrorResponse;
import com.ktts.lecture.exception.ErrorCode;

/**
 * Fixed one-minute window per client IP for the login and register endpoints, to slow down password
 * guessing and mass sign-ups. Per-account lockout (AuthService) covers attacks spread across IPs.
 */
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> LIMITED_PATHS = Set.of("/api/v1/auth/login", "/api/v1/auth/register");
    private static final long WINDOW_MILLIS = 60_000;
    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final int maxRequestsPerWindow;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    private record Window(long startedAt, int count) {}

    public AuthRateLimitFilter(int maxRequestsPerWindow) {
        this.maxRequestsPerWindow = maxRequestsPerWindow;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        long now = System.currentTimeMillis();
        if (windows.size() > MAX_TRACKED_CLIENTS) {
            windows.values().removeIf(window -> now - window.startedAt() > WINDOW_MILLIS);
        }
        Window window = windows.compute(
                request.getRemoteAddr(),
                (ip, current) -> current == null || now - current.startedAt() > WINDOW_MILLIS
                        ? new Window(now, 1)
                        : new Window(current.startedAt(), current.count() + 1));

        if (window.count() > maxRequestsPerWindow) {
            response.setStatus(ErrorCode.RATE_LIMITED.getStatus().value());
            response.setHeader("Retry-After", "60");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(ApiErrorResponse.json(ErrorCode.RATE_LIMITED));
            return;
        }
        filterChain.doFilter(request, response);
    }
}
