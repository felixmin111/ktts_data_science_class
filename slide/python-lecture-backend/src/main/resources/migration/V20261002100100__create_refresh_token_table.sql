-- Only a SHA-256 hash of each refresh token is stored; the raw token lives in an httpOnly cookie.
-- rotated_at: replaced by a newer token (normal refresh). revoked_at: killed by logout or replay detection.
CREATE TABLE refresh_token (
    id           UUID                     PRIMARY KEY,
    user_id      UUID                     NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    token_hash   VARCHAR(64)              NOT NULL,
    family_id    UUID                     NOT NULL,
    expires_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    rotated_at   TIMESTAMP WITH TIME ZONE,
    revoked_at   TIMESTAMP WITH TIME ZONE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_refresh_token_hash UNIQUE (token_hash)
);

CREATE INDEX ix_refresh_token_user ON refresh_token (user_id);
CREATE INDEX ix_refresh_token_family ON refresh_token (family_id);
