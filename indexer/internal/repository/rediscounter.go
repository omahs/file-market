package repository

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
	"math/big"
)

const (
	lastBlockKey = "last_block"
)

type BlockCounter interface {
	GetLastBlock(ctx context.Context) (*big.Int, error)
	SetLastBlock(ctx context.Context, lastBlock *big.Int) error
}

type blockCounter struct {
	rdb *redis.Client
}

func (b *blockCounter) GetLastBlock(ctx context.Context) (*big.Int, error) {
	num := b.rdb.Get(ctx, getKey(ctx))
	if num.Err() != nil {
		log.Printf("key error. Key: %s, err: %s", lastBlockKey, num.Err())
		return nil, num.Err()
	}
	var blockNum string
	if err := num.Scan(&blockNum); err != nil {
		return nil, err
	}
	res, ok := big.NewInt(0).SetString(blockNum, 10)
	if !ok {
		return nil, fmt.Errorf("parse block num: %s failed", blockNum)
	}
	return res, nil
}

func (b *blockCounter) SetLastBlock(ctx context.Context, lastBlock *big.Int) error {
	return b.rdb.Set(ctx, getKey(ctx), lastBlock.String(), redis.KeepTTL).Err()
}

func getKey(ctx context.Context) string {
	mode, ok := ctx.Value("mode").(string)
	if !ok {
		return ""
	}
	key := lastBlockKey
	if mode != "" {
		key = fmt.Sprintf("%s:%s", lastBlockKey, mode)
	}
	return key
}
