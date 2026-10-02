package com.ktts.lecture.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ktts.lecture.domain.AppUser;
import com.ktts.lecture.domain.Role;
import com.ktts.lecture.dto.AuthDtos.UserResponse;
import com.ktts.lecture.dto.ProgressDtos.GameResultResponse;
import com.ktts.lecture.dto.TeacherDtos.StudentDetail;
import com.ktts.lecture.dto.TeacherDtos.StudentSummary;
import com.ktts.lecture.exception.ApiException;
import com.ktts.lecture.exception.ErrorCode;
import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.repository.GameResultRepository;
import com.ktts.lecture.repository.GameResultRepository.UserGameSummary;
import com.ktts.lecture.repository.LessonProgressRepository;
import com.ktts.lecture.repository.LessonProgressRepository.UserProgressSummary;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private static final int DETAIL_GAME_LIMIT = 200;

    private final AppUserRepository userRepository;
    private final LessonProgressRepository progressRepository;
    private final GameResultRepository gameResultRepository;
    private final ProgressService progressService;

    @Transactional(readOnly = true)
    public List<StudentSummary> listStudents() {
        Map<UUID, UserProgressSummary> progress = progressRepository.summarizeByUser().stream()
                .collect(Collectors.toMap(UserProgressSummary::getUserId, Function.identity()));
        Map<UUID, UserGameSummary> games = gameResultRepository.summarizeByUser().stream()
                .collect(Collectors.toMap(UserGameSummary::getUserId, Function.identity()));

        return userRepository.findByRoleOrderByCreatedAtAsc(Role.STUDENT).stream()
                .map(student -> summarize(student, progress.get(student.getId()), games.get(student.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentDetail studentDetail(UUID studentId) {
        AppUser student = userRepository
                .findById(studentId)
                .filter(user -> user.getRole() == Role.STUDENT)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
        var games = gameResultRepository
                .findByUserIdOrderByPlayedAtDesc(studentId, PageRequest.of(0, DETAIL_GAME_LIMIT))
                .map(GameResultResponse::of)
                .getContent();
        return new StudentDetail(UserResponse.of(student), progressService.listProgress(studentId), games);
    }

    private static StudentSummary summarize(AppUser student, UserProgressSummary progress, UserGameSummary games) {
        Instant lastActive = Stream.of(
                        student.getLastLoginAt(),
                        progress == null ? null : progress.getLastVisitedAt(),
                        games == null ? null : games.getLastPlayedAt())
                .filter(Objects::nonNull)
                .max(Instant::compareTo)
                .orElse(null);
        return new StudentSummary(
                student.getId(),
                student.getEmail(),
                student.getDisplayName(),
                student.getCreatedAt(),
                student.getLastLoginAt(),
                lastActive,
                progress == null ? 0 : progress.getLessons(),
                progress == null ? 0 : progress.getSections(),
                games == null ? 0 : games.getRounds());
    }
}
