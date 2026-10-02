package com.ktts.lecture.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.domain.AppUser;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/** Issues and verifies short-lived access tokens (HS256). */
@Service
public class JwtService {

    private static final int MIN_SECRET_BYTES = 32;

    private final SecretKey key;
    private final AppProperties.Jwt properties;

    public JwtService(AppProperties appProperties) {
        this.properties = appProperties.jwt();
        String secret = properties.secret();
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET is not set (generate one with: openssl rand -base64 48)");
        }
        byte[] bytes = Decoders.BASE64.decode(secret);
        if (bytes.length < MIN_SECRET_BYTES) {
            throw new IllegalStateException("JWT_SECRET must decode to at least " + MIN_SECRET_BYTES + " bytes");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String issueAccessToken(AppUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuer(properties.issuer())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(properties.accessTokenTtl())))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /** Returns the user id of a valid token; throws a JwtException if it is forged, expired or malformed. */
    public UUID parseUserId(String token) {
        String subject = Jwts.parser()
                .verifyWith(key)
                .requireIssuer(properties.issuer())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return UUID.fromString(subject);
    }

    public Duration accessTokenTtl() {
        return properties.accessTokenTtl();
    }
}
