package com.ktts.lecture.exception;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApi(ApiException e) {
        return respond(e.getCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleBody(MethodArgumentNotValidException e) {
        List<ApiErrorResponse.Violation> violations = e.getBindingResult().getFieldErrors().stream()
                .map(error -> new ApiErrorResponse.Violation(error.getField(), error.getCode()))
                .toList();
        return ResponseEntity.badRequest().body(new ApiErrorResponse(ErrorCode.VALIDATION_FAILED.name(), violations));
    }

    @ExceptionHandler({
        HandlerMethodValidationException.class,
        HttpMessageNotReadableException.class,
        MethodArgumentTypeMismatchException.class,
        MissingRequestCookieException.class
    })
    public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception e) {
        return respond(ErrorCode.VALIDATION_FAILED);
    }

    @ExceptionHandler({NoResourceFoundException.class, HttpRequestMethodNotSupportedException.class})
    public ResponseEntity<ApiErrorResponse> handleNotFound(Exception e) {
        return respond(ErrorCode.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception e) {
        log.error("Unhandled exception", e);
        return respond(ErrorCode.INTERNAL_ERROR);
    }

    private ResponseEntity<ApiErrorResponse> respond(ErrorCode code) {
        return ResponseEntity.status(code.getStatus()).body(ApiErrorResponse.of(code));
    }
}
