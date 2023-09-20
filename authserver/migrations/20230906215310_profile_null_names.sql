-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles
    ALTER COLUMN username DROP NOT NULL;

ALTER TABLE public.user_profiles
    ALTER COLUMN name DROP NOT NULL;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.user_profiles
    ALTER COLUMN username SET NOT NULL;

ALTER TABLE public.user_profiles
    ALTER COLUMN name SET NOT NULL;
