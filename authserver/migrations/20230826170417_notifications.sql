-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles
    ADD COLUMN is_email_notifications_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.user_profiles
    ADD COLUMN is_push_notifications_enabled BOOLEAN NOT NULL DEFAULT false;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles DROP COLUMN is_email_notifications_enabled;
ALTER TABLE public.user_profiles DROP COLUMN is_push_notifications_enabled;
