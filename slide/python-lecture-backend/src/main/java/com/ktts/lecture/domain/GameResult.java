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

/** One finished round of a game. */
@Entity
@Table(name = "game_result")
@Getter
@Setter
@NoArgsConstructor
public class GameResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String gameId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int correct;

    @Column(nullable = false)
    private int total;

    @Column(nullable = false)
    private int bestStreak;

    @Column(nullable = false)
    private Instant playedAt;
}
