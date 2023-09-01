-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles
    ADD COLUMN is_email_confirmed BOOLEAN NOT NULL DEFAULT true;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles
    DROP COLUMN is_email_confirmed;
