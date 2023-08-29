-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.collection_profiles
 ADD COLUMN banner_url VARCHAR(256) NOT NULL DEFAULT '';

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.collection_profiles
    DROP COLUMN banner_url;