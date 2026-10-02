package com.ktts.lecture.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.ktts.lecture.dto.AuthDtos.UserResponse;
import com.ktts.lecture.dto.ProgressDtos.GameResultResponse;
import com.ktts.lecture.dto.ProgressDtos.SectionVisitResponse;

public final class TeacherDtos {

    private TeacherDtos() {}

    public record StudentSummary(
            UUID id,
            String email,
            String displayName,
            Instant createdAt,
            Instant lastLoginAt,
            Instant lastActiveAt,
            long lessonsStarted,
            long sectionsVisited,
            long gamesPlayed) {}

    public record StudentDetail(
            UserResponse student, List<SectionVisitResponse> progress, List<GameResultResponse> gameResults) {}
}
