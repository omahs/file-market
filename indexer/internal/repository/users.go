package repository

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"strings"
)

func (p *postgres) IsAdmin(ctx context.Context, tx pgx.Tx, address common.Address) (bool, error) {
	// language=PostgreSQL
	query := `
		SELECT COUNT(*) > 0 AS exists
		FROM users
		WHERE address=$1 AND 
		      role=2
	`

	var exists bool
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(&exists); err != nil {
		return false, err
	}

	return exists, nil
}
