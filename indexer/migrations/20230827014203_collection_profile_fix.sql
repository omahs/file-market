-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE collection_profiles
    ADD COLUMN telegram TEXT UNIQUE;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE collection_profiles
    DROP COLUMN telegram;
