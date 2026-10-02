package com.ktts.lecture.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import com.ktts.lecture.domain.GameResult;
import com.ktts.lecture.domain.LessonProgress;

public final class ProgressDtos {

    /** Lesson, section and game ids are short kebab-case slugs, e.g. "ds-7" or "type-detective". */
    public static final String SLUG_PATTERN = "^[a-z0-9][a-z0-9-]{0,63}$";

    private ProgressDtos() {}

    public record SectionVisitResponse(
            String lessonId, String sectionId, int visitCount, Instant firstVisitedAt, Instant lastVisitedAt) {

        public static SectionVisitResponse of(LessonProgress progress) {
            return new SectionVisitResponse(
                    progress.getLessonId(),
                    progress.getSectionId(),
                    progress.getVisitCount(),
                    progress.getFirstVisitedAt(),
                    progress.getLastVisitedAt());
        }
    }

    public record GameResultRequest(
            @NotNull @Pattern(regexp = SLUG_PATTERN) String gameId,
            @NotNull @Min(0) @Max(200_000) Integer score,
            @NotNull @Min(0) @Max(50) Integer correct,
            @NotNull @Min(1) @Max(50) Integer total,
            @NotNull @Min(0) @Max(50) Integer bestStreak) {}

    public record GameResultResponse(
            UUID id, String gameId, int score, int correct, int total, int bestStreak, Instant playedAt) {

        public static GameResultResponse of(GameResult result) {
            return new GameResultResponse(
                    result.getId(),
                    result.getGameId(),
                    result.getScore(),
                    result.getCorrect(),
                    result.getTotal(),
                    result.getBestStreak(),
                    result.getPlayedAt());
        }
    }

    public record RecordedGameResponse(GameResultResponse result, boolean newBest) {}

    public record PageResponse<T>(List<T> items, int page, int size, long totalItems) {}
}
