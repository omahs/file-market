package repository

import (
	"context"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

type postgres struct {
	pg *pgxpool.Pool
}

func NewPostgres(pg *pgxpool.Pool) Repository {
	return &postgres{
		pg: pg,
	}
}

func (p *postgres) BeginTransaction(ctx context.Context, opts pgx.TxOptions) (pgx.Tx, error) {
	return p.pg.BeginTx(ctx, opts)
}

func (p *postgres) CommitTransaction(ctx context.Context, tx pgx.Tx) error {
	return tx.Commit(ctx)
}

func (p *postgres) RollbackTransaction(ctx context.Context, tx pgx.Tx) error {
	return tx.Rollback(ctx)
}
