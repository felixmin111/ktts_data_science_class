CREATE TABLE app_user (
    id                   UUID                     PRIMARY KEY,
    email                VARCHAR(254)             NOT NULL,
    password_hash        VARCHAR(100)             NOT NULL,
    display_name         VARCHAR(60)              NOT NULL,
    role                 VARCHAR(20)              NOT NULL,
    failed_login_count   INTEGER                  NOT NULL DEFAULT 0,
    locked_until         TIMESTAMP WITH TIME ZONE,
    last_login_at        TIMESTAMP WITH TIME ZONE,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_app_user_email UNIQUE (email),
    CONSTRAINT ck_app_user_role CHECK (role IN ('STUDENT', 'TEACHER'))
);
