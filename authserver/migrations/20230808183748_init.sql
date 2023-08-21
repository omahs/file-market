-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE public.auth_messages (
    address    CHAR(42)     NOT NULL,
    message    VARCHAR(255) NOT NULL,
    created_at BIGINT       NOT NULL,
    CONSTRAINT auth_messages_pkey PRIMARY KEY (address)
);
ALTER TABLE public.auth_messages OWNER TO auth_user;

CREATE TABLE public.auth_tokens (
    address    CHAR(42) NOT NULL,
    number     BIGINT   NOT NULL,
    purpose    INTEGER  NOT NULL,
    secret     CHAR(64) NOT NULL,
    expires_at BIGINT   NOT NULL,
    PRIMARY KEY (address, number, purpose)
);
ALTER TABLE public.auth_tokens OWNER TO auth_user;

CREATE TABLE public.users (
    address    CHAR(42) NOT NULL PRIMARY KEY,
    role       INT      NOT NULL,
    created_at BIGINT   NOT NULL
);
ALTER TABLE public.users OWNER TO auth_user;

CREATE TABLE public.user_profiles (
    address     CHAR(42)      NOT NULL PRIMARY KEY,
    username    VARCHAR(32)   NOT NULL UNIQUE,
    name        VARCHAR(32)   NOT NULL UNIQUE,
    bio         VARCHAR(1024) NOT NULL,
    website_url VARCHAR(128)  NOT NULL,
    twitter     VARCHAR(64)            UNIQUE,
    email       VARCHAR(128)           UNIQUE,
    avatar_url  VARCHAR(256)  NOT NULL,
    banner_url  VARCHAR(256)  NOT NULL,
    CONSTRAINT user_profile_users_fkey
        FOREIGN KEY (address)
        REFERENCES public.users(address)
        ON DELETE CASCADE
);
ALTER TABLE public.user_profiles OWNER TO auth_user;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.auth_messages;
DROP TABLE public.auth_tokens;
DROP TABLE public.users;
DROP TABLE public.user_profiles;
