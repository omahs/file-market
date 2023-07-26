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

ALTER TABLE public.auth_messages
    OWNER TO indexer;

CREATE TABLE public.auth_tokens
(
    address    CHAR(42) NOT NULL,
    number     BIGINT   NOT NULL,
    purpose    INTEGER  NOT NULL,
    secret     CHAR(64) NOT NULL,
    expires_at BIGINT   NOT NULL,
    PRIMARY KEY (address, number, purpose)
);

ALTER TABLE public.auth_tokens
    OWNER TO indexer;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.auth_messages;
DROP TABLE public.auth_tokens;