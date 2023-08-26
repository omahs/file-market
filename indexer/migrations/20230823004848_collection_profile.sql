-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
CREATE TABLE public.collection_profiles(
    address     CHAR(42)     NOT NULL PRIMARY KEY,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    website_url TEXT         NOT NULL,
    twitter     TEXT                  UNIQUE,
    discord     TEXT                  UNIQUE
);
ALTER TABLE public.collection_profiles OWNER TO indexer;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
DROP TABLE public.collection_profiles;