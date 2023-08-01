package repository

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"math/big"
	"strings"
	"time"
)

func (p *postgres) ReportCollection(ctx context.Context, tx pgx.Tx, collectionAddress common.Address, walletAddress common.Address) error {
	// language=PostgreSQL
	query := `
		INSERT INTO collections_moderation (collection_address, status, reviewed_by, reviewed_at, submitted_by, submitted_at)
		VALUES ($1,$2,$3,$4,$5,$6)
	`

	now := time.Now().UnixMilli()

	if _, err := tx.Exec(ctx, query,
		strings.ToLower(collectionAddress.String()),
		"Rejected",
		strings.ToLower(walletAddress.String()),
		now,
		strings.ToLower(walletAddress.String()),
		now,
	); err != nil {
		return err
	}

	return nil
}

func (p *postgres) ReportToken(ctx context.Context, tx pgx.Tx, collectionAddress common.Address, tokenId *big.Int, walletAddress common.Address) error {
	// language=PostgreSQL
	query := `
		INSERT INTO tokens_moderation (collection_address, token_id, status, reviewed_by, reviewed_at, submitted_by, submitted_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
	`

	now := time.Now().UnixMilli()

	if _, err := tx.Exec(ctx, query,
		strings.ToLower(collectionAddress.String()),
		tokenId.String(),
		"Rejected",
		strings.ToLower(walletAddress.String()),
		now,
		strings.ToLower(walletAddress.String()),
		now,
	); err != nil {
		return err
	}

	return nil
}
