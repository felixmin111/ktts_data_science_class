CREATE TABLE game_result (
    id           UUID                     PRIMARY KEY,
    user_id      UUID                     NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    game_id      VARCHAR(64)              NOT NULL,
    score        INTEGER                  NOT NULL,
    correct      INTEGER                  NOT NULL,
    total        INTEGER                  NOT NULL,
    best_streak  INTEGER                  NOT NULL,
    played_at    TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX ix_game_result_user_played ON game_result (user_id, played_at);
CREATE INDEX ix_game_result_user_game ON game_result (user_id, game_id);
