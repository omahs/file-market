package domain

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

type Collection struct {
	Address     common.Address
	Creator     common.Address
	Owner       common.Address
	TokenId     *big.Int
	MetaUri     string
	Name        string
	Description string
	Image       string
	Type        string
	BlockNumber int64
	OrdersCount uint64
	OwnersCount uint64
	TokensCount uint64
	SalesVolume *big.Int
	FloorPrice  *big.Int
}

type CollectionTransfer struct {
	Timestamp int64
	From      common.Address
	To        common.Address
	TxId      common.Hash
}

func CollectionToModel(c *Collection) *models.Collection {
	return &models.Collection{
		Address: c.Address.String(),
		Block: &models.CollectionBlock{
			ConfirmationsCount: 1,
			Number:             c.BlockNumber,
		},
		Creator:     c.Creator.String(),
		Description: c.Description,
		Image:       c.Image,
		MetaURI:     c.MetaUri,
		Name:        c.Name,
		Owner:       c.Owner.String(),
		TokenID:     c.TokenId.String(),
		ChainID:     cfg.Service.ChainID,
		OrdersCount: c.OrdersCount,
		OwnersCount: c.OwnersCount,
		TokensCount: c.TokensCount,
		Type:        c.Type,
		SalesVolume: c.SalesVolume.String(),
		FloorPrice:  c.FloorPrice.String(),
	}
}

type CollectionStats struct {
	Name  string
	Value float64
}
