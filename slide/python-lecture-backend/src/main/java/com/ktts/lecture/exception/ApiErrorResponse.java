package com.ktts.lecture.exception;

import java.util.List;

public record ApiErrorResponse(String code, List<Violation> violations) {

    public record Violation(String field, String reason) {}

    public static ApiErrorResponse of(ErrorCode code) {
        return new ApiErrorResponse(code.name(), List.of());
    }

    /** Minimal JSON for filters that run before Spring MVC's message converters. */
    public static String json(ErrorCode code) {
        return "{\"code\":\"" + code.name() + "\",\"violations\":[]}";
    }
}
