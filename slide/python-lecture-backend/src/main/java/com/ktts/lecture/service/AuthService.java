package com.ktts.lecture.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.domain.AppUser;
import com.ktts.lecture.domain.Role;
import com.ktts.lecture.dto.AuthDtos.LoginRequest;
import com.ktts.lecture.dto.AuthDtos.RegisterRequest;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.security.JwtService;
import com.ktts.lecture.security.RefreshTokenService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    private static final int BCRYPT_MAX_BYTES = 72;

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AppProperties.Login loginProperties;
    /** Compared against when the email is unknown, so both cases take the same time. */
    private final String dummyPasswordHash;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            AppProperties appProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.loginProperties = appProperties.login();
        this.dummyPasswordHash = passwordEncoder.encode("timing-equaliser-not-a-real-password-1");
    }

    /** A signed-in session: the user, a short-lived access token and the raw refresh token for the cookie. */
    public record Session(AppUser user, String accessToken, String refreshToken) {}

    @Transactional
    public Session register(RegisterRequest request) {
        AppUser user = createUser(request.email(), request.password(), request.displayName(), Role.STUDENT);
        return startSession(user);
    }

    @Transactional
    public AppUser createUser(String email, String password, String displayName, Role role) {
        String normalizedEmail = normalizeEmail(email);
        if (password.getBytes(StandardCharsets.UTF_8).length > BCRYPT_MAX_BYTES) {
            throw new ApiException(ErrorCode.WEAK_PASSWORD);
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ApiException(ErrorCode.EMAIL_TAKEN);
        }
        AppUser user = new AppUser();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName.strip());
        user.setRole(role);
        return userRepository.save(user);
    }

    /** Failed attempts are committed even though the method throws, so the lockout counter survives. */
    @Transactional(noRollbackFor = ApiException.class)
    public Session login(LoginRequest request) {
        AppUser user =
                userRepository.findByEmail(normalizeEmail(request.email())).orElse(null);
        if (user == null) {
            passwordEncoder.matches(request.password(), dummyPasswordHash);
            throw new ApiException(ErrorCode.INVALID_CREDENTIALS);
        }

        Instant now = Instant.now();
        if (user.isLocked(now)) {
            throw new ApiException(ErrorCode.ACCOUNT_LOCKED);
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            int failures = user.getFailedLoginCount() + 1;
            if (failures >= loginProperties.maxFailedAttempts()) {
                user.setLockedUntil(now.plus(loginProperties.lockDuration()));
                user.setFailedLoginCount(0);
                log.warn("Account {} locked after {} failed logins", user.getId(), failures);
            } else {
                user.setFailedLoginCount(failures);
            }
            throw new ApiException(ErrorCode.INVALID_CREDENTIALS);
        }

        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(now);
        return startSession(user);
    }

    @Transactional(noRollbackFor = ApiException.class)
    public Session refresh(String rawRefreshToken) {
        RefreshTokenService.Issued issued = refreshTokenService.rotate(rawRefreshToken);
        AppUser user = userRepository
                .findById(issued.userId())
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));
        return new Session(user, jwtService.issueAccessToken(user), issued.rawToken());
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenService.revoke(rawRefreshToken);
        }
    }

    private Session startSession(AppUser user) {
        String refreshToken = refreshTokenService.issue(user.getId()).rawToken();
        return new Session(user, jwtService.issueAccessToken(user), refreshToken);
    }

    private static String normalizeEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }
}
