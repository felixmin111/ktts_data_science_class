package com.ktts.lecture.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.domain.RefreshToken;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Opaque, rotating refresh tokens. Every refresh marks the presented token as rotated and issues a new
 * one in the same family. Presenting an already-rotated token means it was stolen and replayed, so the
 * whole family is revoked — except within a short grace window, which covers two tabs refreshing at
 * once. Tokens revoked by logout or replay detection are never accepted again.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;
    private static final Duration CONCURRENT_REFRESH_GRACE = Duration.ofSeconds(30);

    private final SecureRandom random = new SecureRandom();
    private final RefreshTokenRepository repository;
    private final AppProperties appProperties;

    public record Issued(String rawToken, UUID userId) {}

    @Transactional
    public Issued issue(UUID userId) {
        return issue(userId, UUID.randomUUID());
    }

    @Transactional(noRollbackFor = ApiException.class)
    public Issued rotate(String rawToken) {
        RefreshToken current = repository
                .findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));
        Instant now = Instant.now();

        if (current.getRevokedAt() != null || current.getExpiresAt().isBefore(now)) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        if (current.getRotatedAt() != null) {
            boolean concurrentRefresh =
                    current.getRotatedAt().plus(CONCURRENT_REFRESH_GRACE).isAfter(now);
            if (!concurrentRefresh) {
                log.warn("Refresh token reuse detected for user {}; revoking its session", current.getUserId());
                repository.revokeFamily(current.getFamilyId(), now);
                throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
            }
        } else {
            current.setRotatedAt(now);
        }
        return issue(current.getUserId(), current.getFamilyId());
    }

    @Transactional
    public void revoke(String rawToken) {
        repository
                .findByTokenHash(hash(rawToken))
                .ifPresent(token -> repository.revokeFamily(token.getFamilyId(), Instant.now()));
    }

    @Transactional
    public void revokeAllForUser(UUID userId) {
        repository.revokeAllForUser(userId, Instant.now());
    }

    @Scheduled(cron = "0 30 3 * * *")
    @Transactional
    public void deleteStaleTokens() {
        int deleted = repository.deleteStale(Instant.now().minus(Duration.ofDays(1)));
        log.info("Deleted {} stale refresh tokens", deleted);
    }

    public Duration ttl() {
        return appProperties.jwt().refreshTokenTtl();
    }

    private Issued issue(UUID userId, UUID familyId) {
        byte[] bytes = new byte[TOKEN_BYTES];
        random.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setFamilyId(familyId);
        token.setTokenHash(hash(raw));
        token.setExpiresAt(Instant.now().plus(ttl()));
        repository.save(token);
        return new Issued(raw, userId);
    }

    private static String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
