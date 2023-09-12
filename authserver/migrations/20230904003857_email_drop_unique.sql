-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles DROP CONSTRAINT user_profiles_email_key;
CREATE INDEX user_profiles_email_conf_idx ON public.user_profiles(email, is_email_confirmed);

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
DROP INDEX user_profiles_email_conf_idx;
