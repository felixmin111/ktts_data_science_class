package com.ktts.lecture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;

import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.repository.RefreshTokenRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@SpringBootTest
@AutoConfigureMockMvc
class AuthApiTest extends ApiTestSupport {

    @Autowired
    AppUserRepository userRepository;

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    TransactionTemplate transactionTemplate;

    @Test
    void registerHashesPasswordAndSetsHardenedRefreshCookie() throws Exception {
        String email = uniqueEmail();
        MvcResult result = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(email.toUpperCase(), PASSWORD)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.role").value("STUDENT"))
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andReturn();

        String setCookie = result.getResponse().getHeader("Set-Cookie");
        assertThat(setCookie)
                .contains("pl_refresh=")
                .contains("HttpOnly")
                .contains("Secure")
                .contains("SameSite=Strict")
                .contains("Path=/api/v1/auth");

        String hash = userRepository.findByEmail(email).orElseThrow().getPasswordHash();
        assertThat(hash).startsWith("$2").doesNotContain(PASSWORD);
    }

    @Test
    void registerRejectsDuplicateEmailIgnoringCase() throws Exception {
        String email = uniqueEmail();
        register(email);
        mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("  " + email.toUpperCase() + " ", PASSWORD)))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(email.toUpperCase(), PASSWORD)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("EMAIL_TAKEN"));
    }

    @Test
    void registerRejectsWeakPasswordsAndBadEmails() throws Exception {
        for (String password : new String[] {"short1", "onlyletters", "12345678", "a1".repeat(40)}) {
            mvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(uniqueEmail(), password)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        }
        mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("not-an-email", PASSWORD)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginGivesTheSameErrorForUnknownEmailAndWrongPassword() throws Exception {
        String email = uniqueEmail();
        register(email);
        for (String[] attempt : new String[][] {{email, "wrong-password1"}, {uniqueEmail(), PASSWORD}}) {
            mvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(attempt[0], attempt[1])))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
        }
        login(email, PASSWORD);
    }

    @Test
    void accountLocksAfterFiveFailedLogins() throws Exception {
        String email = uniqueEmail();
        register(email);
        for (int i = 0; i < 5; i++) {
            mvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json(email, "wrong-password1")))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(email, PASSWORD)))
                .andExpect(status().isLocked())
                .andExpect(jsonPath("$.code").value("ACCOUNT_LOCKED"));
    }

    @Test
    void protectedEndpointsNeedAValidAccessToken() throws Exception {
        Account account = register(uniqueEmail());
        mvc.perform(get("/api/v1/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/me").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());

        String forged = Jwts.builder()
                .subject(account.userId())
                .issuer("python-lecture")
                .claim("role", "TEACHER")
                .expiration(Date.from(Instant.now().plusSeconds(600)))
                .signWith(Keys.hmacShaKeyFor(new byte[48]))
                .compact();
        mvc.perform(get("/api/v1/me").header("Authorization", "Bearer " + forged))
                .andExpect(status().isUnauthorized());

        mvc.perform(get("/api/v1/me").header("Authorization", bearer(account)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(account.email()));
    }

    @Test
    void refreshRotatesTheTokenAndNeedsTheCsrfHeader() throws Exception {
        Account account = register(uniqueEmail());

        mvc.perform(post("/api/v1/auth/refresh").cookie(account.refreshCookie()))
                .andExpect(status().isForbidden());

        MvcResult refreshed = mvc.perform(post("/api/v1/auth/refresh")
                        .cookie(account.refreshCookie())
                        .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andReturn();
        Cookie rotated = refreshed.getResponse().getCookie("pl_refresh");
        assertThat(rotated.getValue()).isNotEqualTo(account.refreshCookie().getValue());

        mvc.perform(post("/api/v1/auth/refresh").cookie(rotated).header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isOk());
    }

    @Test
    void twoTabsRefreshingWithTheSameTokenAtOnceBothSucceed() throws Exception {
        Account account = register(uniqueEmail());
        for (int tab = 0; tab < 2; tab++) {
            mvc.perform(post("/api/v1/auth/refresh")
                            .cookie(account.refreshCookie())
                            .header("X-Requested-With", "XMLHttpRequest"))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void replayingAnOldRefreshTokenRevokesTheWholeSession() throws Exception {
        Account account = register(uniqueEmail());
        MvcResult refreshed = mvc.perform(post("/api/v1/auth/refresh")
                        .cookie(account.refreshCookie())
                        .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isOk())
                .andReturn();
        Cookie current = refreshed.getResponse().getCookie("pl_refresh");

        // Push the first token's rotation past the concurrent-refresh grace window.
        transactionTemplate.executeWithoutResult(tx -> refreshTokenRepository.findAll().stream()
                .filter(token -> token.getUserId().equals(UUID.fromString(account.userId())))
                .filter(token -> token.getRotatedAt() != null)
                .forEach(token -> token.setRotatedAt(Instant.now().minusSeconds(120))));

        mvc.perform(post("/api/v1/auth/refresh")
                        .cookie(account.refreshCookie())
                        .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_REFRESH_TOKEN"));

        // The stolen token's family is gone, so even the legitimate latest token stops working.
        mvc.perform(post("/api/v1/auth/refresh").cookie(current).header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logoutRevokesTheRefreshTokenAndClearsTheCookie() throws Exception {
        Account account = register(uniqueEmail());
        MvcResult result = mvc.perform(post("/api/v1/auth/logout")
                        .cookie(account.refreshCookie())
                        .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isNoContent())
                .andReturn();
        assertThat(result.getResponse().getHeader("Set-Cookie")).contains("Max-Age=0");

        mvc.perform(post("/api/v1/auth/refresh")
                        .cookie(account.refreshCookie())
                        .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized());
    }
}
