package com.ktts.lecture.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ktts.lecture.domain.GameResult;
import com.ktts.lecture.domain.LessonProgress;
import com.ktts.lecture.dto.ProgressDtos.GameResultRequest;
import com.ktts.lecture.dto.ProgressDtos.GameResultResponse;
import com.ktts.lecture.dto.ProgressDtos.PageResponse;
import com.ktts.lecture.dto.ProgressDtos.RecordedGameResponse;
import com.ktts.lecture.dto.ProgressDtos.SectionVisitResponse;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.GameResultRepository;
import com.ktts.lecture.repository.LessonProgressRepository;

import lombok.RequiredArgsConstructor;

/** Lesson progress and game history, always scoped to one user. */
@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LessonProgressRepository progressRepository;
    private final GameResultRepository gameResultRepository;

    @Transactional(readOnly = true)
    public List<SectionVisitResponse> listProgress(UUID userId) {
        return progressRepository.findByUserIdOrderByLastVisitedAtDesc(userId).stream()
                .map(SectionVisitResponse::of)
                .toList();
    }

    @Transactional
    public SectionVisitResponse markVisited(UUID userId, String lessonId, String sectionId) {
        Instant now = Instant.now();
        LessonProgress progress = progressRepository
                .findByUserIdAndLessonIdAndSectionId(userId, lessonId, sectionId)
                .orElseGet(() -> {
                    LessonProgress created = new LessonProgress();
                    created.setUserId(userId);
                    created.setLessonId(lessonId);
                    created.setSectionId(sectionId);
                    created.setFirstVisitedAt(now);
                    return created;
                });
        progress.setVisitCount(progress.getVisitCount() + 1);
        progress.setLastVisitedAt(now);
        return SectionVisitResponse.of(progressRepository.save(progress));
    }

    @Transactional
    public void resetLesson(UUID userId, String lessonId) {
        progressRepository.deleteByUserIdAndLessonId(userId, lessonId);
    }

    @Transactional
    public RecordedGameResponse recordGame(UUID userId, GameResultRequest request) {
        if (request.correct() > request.total() || request.bestStreak() > request.correct()) {
            throw new ApiException(ErrorCode.VALIDATION_FAILED);
        }
        Integer previousBest = gameResultRepository.findBestScore(userId, request.gameId());

        GameResult result = new GameResult();
        result.setUserId(userId);
        result.setGameId(request.gameId());
        result.setScore(request.score());
        result.setCorrect(request.correct());
        result.setTotal(request.total());
        result.setBestStreak(request.bestStreak());
        result.setPlayedAt(Instant.now());
        GameResult saved = gameResultRepository.save(result);

        boolean newBest = previousBest == null || request.score() > previousBest;
        return new RecordedGameResponse(GameResultResponse.of(saved), newBest);
    }

    @Transactional(readOnly = true)
    public PageResponse<GameResultResponse> gameHistory(UUID userId, int page, int size) {
        var results = gameResultRepository.findByUserIdOrderByPlayedAtDesc(userId, PageRequest.of(page, size));
        return new PageResponse<>(
                results.map(GameResultResponse::of).getContent(), page, size, results.getTotalElements());
    }

    /** The best round per game; on a tie the earliest round wins. */
    @Transactional(readOnly = true)
    public List<GameResultResponse> bestPerGame(UUID userId) {
        Map<String, GameResult> best = new LinkedHashMap<>();
        gameResultRepository.findBestRounds(userId).forEach(round -> best.putIfAbsent(round.getGameId(), round));
        return best.values().stream().map(GameResultResponse::of).toList();
    }
}
