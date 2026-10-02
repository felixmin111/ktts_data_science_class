package com.ktts.lecture;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import jakarta.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

@ActiveProfiles("test")
abstract class ApiTestSupport {

    static final String PASSWORD = "lecture2026";

    @Autowired
    MockMvc mvc;

    record Account(String email, String accessToken, Cookie refreshCookie, String userId) {}

    static String uniqueEmail() {
        return "student-" + UUID.randomUUID() + "@example.com";
    }

    static String json(String email, String password) {
        return """
                {"email":"%s","password":"%s","displayName":"Neo"}""".formatted(email, password);
    }

    Account register(String email) throws Exception {
        MvcResult result = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(email, PASSWORD)))
                .andExpect(status().isCreated())
                .andReturn();
        return account(email, result);
    }

    Account login(String email, String password) throws Exception {
        MvcResult result = mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(email, password)))
                .andExpect(status().isOk())
                .andReturn();
        return account(email, result);
    }

    static Account account(String email, MvcResult result) throws Exception {
        String body = result.getResponse().getContentAsString();
        return new Account(
                email,
                JsonPath.read(body, "$.accessToken"),
                result.getResponse().getCookie("pl_refresh"),
                JsonPath.read(body, "$.user.id"));
    }

    static String bearer(Account account) {
        return "Bearer " + account.accessToken();
    }
}
