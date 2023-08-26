-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE auth_server.public.user_profiles
    ADD COLUMN discord TEXT UNIQUE;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE auth_server.public.user_profiles
    DROP COLUMN discord;
