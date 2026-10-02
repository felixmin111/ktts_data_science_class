package com.ktts.lecture.security;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ktts.lecture.repository.AppUserRepository;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Authenticates "Authorization: Bearer <access token>". The user is re-read from the database so a
 * deleted account or changed role takes effect immediately. Invalid tokens leave the request
 * anonymous; protected endpoints then answer 401.
 */
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER = "Bearer ";

    private final JwtService jwtService;
    private final AppUserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(AUTHORIZATION);
        if (header != null && header.startsWith(BEARER)) {
            try {
                userRepository
                        .findById(jwtService.parseUserId(header.substring(BEARER.length())))
                        .map(AuthUser::of)
                        .ifPresent(user -> {
                            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.role()));
                            var authentication =
                                    UsernamePasswordAuthenticationToken.authenticated(user, null, authorities);
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        });
            } catch (JwtException | IllegalArgumentException e) {
                log.debug("Rejected access token: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
