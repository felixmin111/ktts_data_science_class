package com.ktts.lecture.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ktts.lecture.domain.LessonProgress;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {

    List<LessonProgress> findByUserIdOrderByLastVisitedAtDesc(UUID userId);

    Optional<LessonProgress> findByUserIdAndLessonIdAndSectionId(UUID userId, String lessonId, String sectionId);

    long deleteByUserIdAndLessonId(UUID userId, String lessonId);

    @Query("""
            select p.userId as userId, count(p) as sections, count(distinct p.lessonId) as lessons,
                   max(p.lastVisitedAt) as lastVisitedAt
            from LessonProgress p group by p.userId
            """)
    List<UserProgressSummary> summarizeByUser();

    interface UserProgressSummary {
        UUID getUserId();

        Long getSections();

        Long getLessons();

        Instant getLastVisitedAt();
    }
}
