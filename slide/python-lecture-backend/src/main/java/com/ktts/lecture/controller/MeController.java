package com.ktts.lecture.controller;

import static com.ktts.lecture.dto.ProgressDtos.SLUG_PATTERN;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ktts.lecture.dto.AuthDtos.UserResponse;
import com.ktts.lecture.dto.ProgressDtos.GameResultRequest;
import com.ktts.lecture.dto.ProgressDtos.GameResultResponse;
import com.ktts.lecture.dto.ProgressDtos.PageResponse;
import com.ktts.lecture.dto.ProgressDtos.RecordedGameResponse;
import com.ktts.lecture.dto.ProgressDtos.SectionVisitResponse;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.security.AuthUser;
import com.ktts.lecture.service.ProgressService;

import lombok.RequiredArgsConstructor;

/** Everything here reads or writes only the signed-in user's own data. */
@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class MeController {

    private final AppUserRepository userRepository;
    private final ProgressService progressService;

    @GetMapping
    public UserResponse me(@AuthenticationPrincipal AuthUser user) {
        return userRepository
                .findById(user.id())
                .map(UserResponse::of)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED));
    }

    @GetMapping("/progress")
    public List<SectionVisitResponse> progress(@AuthenticationPrincipal AuthUser user) {
        return progressService.listProgress(user.id());
    }

    @PutMapping("/progress/{lessonId}/{sectionId}")
    public SectionVisitResponse markVisited(
            @AuthenticationPrincipal AuthUser user,
            @PathVariable @Pattern(regexp = SLUG_PATTERN) String lessonId,
            @PathVariable @Pattern(regexp = SLUG_PATTERN) String sectionId) {
        return progressService.markVisited(user.id(), lessonId, sectionId);
    }

    @DeleteMapping("/progress/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetLesson(
            @AuthenticationPrincipal AuthUser user, @PathVariable @Pattern(regexp = SLUG_PATTERN) String lessonId) {
        progressService.resetLesson(user.id(), lessonId);
    }

    @PostMapping("/game-results")
    @ResponseStatus(HttpStatus.CREATED)
    public RecordedGameResponse recordGame(
            @AuthenticationPrincipal AuthUser user, @Valid @RequestBody GameResultRequest request) {
        return progressService.recordGame(user.id(), request);
    }

    @GetMapping("/game-results")
    public PageResponse<GameResultResponse> gameHistory(
            @AuthenticationPrincipal AuthUser user,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return progressService.gameHistory(user.id(), page, size);
    }

    @GetMapping("/game-results/best")
    public List<GameResultResponse> bestPerGame(@AuthenticationPrincipal AuthUser user) {
        return progressService.bestPerGame(user.id());
    }
}
