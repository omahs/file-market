package repository

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"strings"
	"time"
)

func (p *postgres) GetUserRole(ctx context.Context, tx pgx.Tx, address common.Address) (domain.UserRole, error) {
	// language=PostgreSQL
	query := `
		SELECT role
		FROM users
		WHERE address=$1
	`

	var role int
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(&role); err != nil {
		return 0, err
	}

	return domain.UserRole(role), nil
}

func (p *postgres) InsertUser(ctx context.Context, tx pgx.Tx, user *domain.User) error {
	// language=PostgreSQL
	query := `
		INSERT INTO users (address, role, created_at) 
		VALUES ($1, $2, $3)
	`
	_, err := tx.Exec(ctx, query,
		strings.ToLower(user.Address.String()),
		user.Role,
		time.Now().UnixMilli(),
	)

	return err
}

func (p *postgres) UserExists(ctx context.Context, tx pgx.Tx, address common.Address) (bool, error) {
	// language=PostgreSQL
	query := `
		SELECT COUNT(*) > 0
		FROM users
		WHERE address=$1
	`

	var exists bool
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(&exists); err != nil {
		return false, err
	}

	return exists, nil
}
