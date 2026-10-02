package com.ktts.lecture.config.properties;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app")
public record AppProperties(
        Jwt jwt, Cookie cookie, Login login, RateLimit rateLimit, Cors cors, BootstrapTeacher bootstrapTeacher) {

    public record Jwt(String secret, String issuer, Duration accessTokenTtl, Duration refreshTokenTtl) {}

    public record Cookie(boolean secure) {}

    public record Login(int maxFailedAttempts, Duration lockDuration) {}

    public record RateLimit(int authRequestsPerMinute) {}

    public record Cors(List<String> allowedOrigins) {}

    public record BootstrapTeacher(String email, String password, String displayName) {}
}
