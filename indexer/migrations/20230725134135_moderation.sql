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
ALTER TABLE public.auth_messages OWNER TO indexer;

CREATE TABLE public.auth_tokens (
    address    CHAR(42) NOT NULL,
    number     BIGINT   NOT NULL,
    purpose    INTEGER  NOT NULL,
    secret     CHAR(64) NOT NULL,
    expires_at BIGINT   NOT NULL,
    PRIMARY KEY (address, number, purpose)
);
ALTER TABLE public.auth_tokens OWNER TO indexer;

CREATE TABLE public.collections_moderation (
    collection_address CHAR(42)     NOT NULL PRIMARY KEY,
    status             VARCHAR(255) NOT NULL,
    reviewed_by        CHAR(42)     NOT NULL,
    reviewed_at        BIGINT       NOT NULL,
    submitted_by       CHAR(42)     NOT NULL,
    submitted_at       BIGINT       NOT NULL,
    CONSTRAINT collections_moderation_fkey
        FOREIGN KEY (collection_address)
            REFERENCES public.collections (address)
            ON DELETE NO ACTION
);
CREATE INDEX idx_collections_moderation_rejected ON collections_moderation USING hash (status) WHERE status='Rejected';
ALTER TABLE public.collections_moderation OWNER TO indexer;

CREATE TABLE public.tokens_moderation (
    collection_address CHAR(42)     NOT NULL,
    token_id           VARCHAR(255) NOT NULL,
    status             VARCHAR(255) NOT NULL,
    reviewed_by        CHAR(42)     NOT NULL,
    reviewed_at        BIGINT       NOT NULL,
    submitted_by       CHAR(42)     NOT NULL,
    submitted_at       BIGINT       NOT NULL,
    PRIMARY KEY (collection_address, token_id),
    CONSTRAINT tokens_moderation_fkey
        FOREIGN KEY (collection_address, token_id)
        REFERENCES public.tokens (collection_address, token_id)
        ON DELETE NO ACTION
);
CREATE INDEX idx_tokens_moderation_rejected ON tokens_moderation USING hash(status) WHERE status='Rejected';
ALTER TABLE public.tokens_moderation OWNER TO indexer;

CREATE TABLE public.users (
    address CHAR(42) NOT NULL PRIMARY KEY,
    role INT NOT NULL
);
ALTER TABLE public.users OWNER TO indexer;

CREATE VIEW rejected_collections AS
    SELECT collection_address
    FROM collections_moderation
    WHERE status = 'Rejected';


CREATE VIEW rejected_tokens AS
    SELECT collection_address, token_id
    FROM tokens_moderation
    WHERE status = 'Rejected';

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.auth_messages;
DROP TABLE public.auth_tokens;
DROP INDEX idx_tokens_moderation_rejected;
DROP INDEX idx_collections_moderation_rejected;
DROP VIEW rejected_collections;
DROP VIEW rejected_tokens;
DROP TABLE public.collections_moderation;
DROP TABLE public.tokens_moderation;
DROP TABLE public.users;
