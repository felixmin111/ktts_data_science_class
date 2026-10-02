CREATE TABLE lesson_progress (
    id                UUID                     PRIMARY KEY,
    user_id           UUID                     NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    lesson_id         VARCHAR(64)              NOT NULL,
    section_id        VARCHAR(64)              NOT NULL,
    visit_count       INTEGER                  NOT NULL,
    first_visited_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    last_visited_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_lesson_progress UNIQUE (user_id, lesson_id, section_id)
);
