-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

CREATE TABLE public.email_verification_tokens (
    token      VARCHAR(32)  NOT NULL PRIMARY KEY ,
    address    CHAR(42)     NOT NULL,
    email      VARCHAR(128) NOT NULL,
    created_at BIGINT       NOT NULL,
    CONSTRAINT email_verification_tokens_users_fkey
        FOREIGN KEY (address)
        REFERENCES public.users(address)
        ON DELETE CASCADE
);
ALTER TABLE public.email_verification_tokens OWNER TO indexer;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd

DROP TABLE email_verification_tokens;