package repository

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/jwt"
	"strings"
	"time"
)

func (p *postgres) GetAuthMessage(ctx context.Context, tx pgx.Tx, address common.Address) (*domain.AuthMessage, error) {
	query := `
		SELECT message, created_at
		FROM public.auth_messages
		WHERE address = $1
	`
	msg := domain.AuthMessage{
		Address: address,
	}
	var createdAt int64
	err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(&msg.Message, createdAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get auth message: %w", err)
	}

	msg.CreatedAt = time.UnixMilli(createdAt)

	return &msg, nil
}

func (p *postgres) InsertAuthMessage(ctx context.Context, tx pgx.Tx, msg domain.AuthMessage) error {
	query := `
		INSERT INTO auth_messages (address, message, created_at)
		VALUES ($1,$2,$3)
	`

	if _, err := tx.Exec(ctx, query,
		strings.ToLower(msg.Address.String()),
		msg.Message,
		msg.CreatedAt.UnixMilli(),
	); err != nil {
		return fmt.Errorf("failed to insert auth message: %w", err)
	}

	return nil
}

func (p *postgres) DeleteAuthMessage(ctx context.Context, tx pgx.Tx, address common.Address) error {
	query := `
		DELETE FROM auth_messages
		WHERE address = $1
	`

	if _, err := tx.Exec(ctx, query,
		strings.ToLower(address.String()),
	); err != nil {
		return fmt.Errorf("failed to delete auth message: %w", err)
	}

	return nil
}

func (p *postgres) GetJwtTokenNumber(ctx context.Context, tx pgx.Tx, address common.Address, purpose jwt.Purpose) (int, error) {
	rows, err := tx.Query(ctx, `SELECT number FROM auth_tokens WHERE address=$1 AND purpose=$2 ORDER BY number`,
		strings.ToLower(address.String()),
		int(purpose),
	)
	if err != nil {
		return 0, fmt.Errorf("GetTokenJwtNumber/Query: %w", err)
	}
	defer rows.Close()

	var number int
	if rowExist := rows.Next(); !rowExist {
		return number, nil
	}
	if err := rows.Scan(&number); err != nil {
		return 0, fmt.Errorf("GetTokenJwtNumber/Scan: %w", err)
	}

	nextNum := number + 1
	for rows.Next() {
		if err := rows.Scan(&number); err != nil {
			return 0, fmt.Errorf("GetTokenJwtNumber/Next/Scan: %w", err)
		}

		if number != nextNum {
			return nextNum, nil
		}

		nextNum++
	}

	return nextNum, nil
}

func (r *postgres) InsertJwtToken(ctx context.Context, tx pgx.Tx, tokenData jwt.TokenData) error {
	if _, err := tx.Exec(ctx, `INSERT INTO auth_tokens VALUES($1, $2, $3, $4, $5)`,
		tokenData.Address,
		tokenData.Number,
		tokenData.Purpose,
		tokenData.Secret,
		tokenData.ExpiresAt.UnixMilli(),
	); err != nil {
		return err
	}

	return nil
}

func (r *postgres) DropJwtTokens(ctx context.Context, tx pgx.Tx, address common.Address, number int) error {
	_, err := tx.Exec(ctx, `DELETE FROM auth_tokens WHERE address=$1 AND number=$2`,
		strings.ToLower(address.String()),
		number,
	)

	return err
}

func (r *postgres) DropAllJwtTokens(ctx context.Context, tx pgx.Tx, address common.Address) error {
	_, err := tx.Exec(ctx, `DELETE FROM auth_tokens WHERE address=$1`, strings.ToLower(address.String()))

	return err
}

func (p *postgres) GetJwtTokenSecret(ctx context.Context, tx pgx.Tx, address common.Address, number int, purpose jwt.Purpose) (string, error) {
	var secret string

	err := tx.QueryRow(ctx, `SELECT secret FROM auth_tokens WHERE address=$1 AND number=$2 AND purpose=$3`,
		strings.ToLower(address.String()),
		number,
		purpose,
	).Scan(&secret)

	return secret, err
}
