package com.ktts.lecture.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ktts.lecture.domain.GameResult;

public interface GameResultRepository extends JpaRepository<GameResult, UUID> {

    Page<GameResult> findByUserIdOrderByPlayedAtDesc(UUID userId, Pageable pageable);

    @Query("select max(r.score) from GameResult r where r.userId = :userId and r.gameId = :gameId")
    Integer findBestScore(@Param("userId") UUID userId, @Param("gameId") String gameId);

    /** Every round that equals the user's best score for its game (ties included), oldest first. */
    @Query("""
            select r from GameResult r
            where r.userId = :userId
              and r.score = (select max(r2.score) from GameResult r2
                             where r2.userId = :userId and r2.gameId = r.gameId)
            order by r.playedAt asc
            """)
    List<GameResult> findBestRounds(@Param("userId") UUID userId);

    @Query("""
            select r.userId as userId, count(r) as rounds, max(r.playedAt) as lastPlayedAt
            from GameResult r group by r.userId
            """)
    List<UserGameSummary> summarizeByUser();

    interface UserGameSummary {
        UUID getUserId();

        Long getRounds();

        Instant getLastPlayedAt();
    }
}
