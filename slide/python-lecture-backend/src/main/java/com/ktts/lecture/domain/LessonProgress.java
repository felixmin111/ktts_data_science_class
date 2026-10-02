package com.ktts.lecture.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** One row per (user, lesson, section): when it was first and last opened, and how often. */
@Entity
@Table(name = "lesson_progress")
@Getter
@Setter
@NoArgsConstructor
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String lessonId;

    @Column(nullable = false)
    private String sectionId;

    @Column(nullable = false)
    private int visitCount;

    @Column(nullable = false)
    private Instant firstVisitedAt;

    @Column(nullable = false)
    private Instant lastVisitedAt;
}
