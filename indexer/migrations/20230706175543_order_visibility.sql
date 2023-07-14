-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders ADD COLUMN visibility VARCHAR(255);
UPDATE public.orders SET visibility='Visible' WHERE orders.visibility IS NULL;
ALTER TABLE public.orders ALTER COLUMN visibility SET NOT NULL;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
ALTER TABLE public.orders DROP COLUMN visibility;