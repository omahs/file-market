package service

import (
	"context"
	"encoding/hex"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/ethsigner"
	"log"
	"net/http"
)

func (s *service) AddressInWhitelist(ctx context.Context, address common.Address) (*models.WhitelistResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	rarity, err := s.repository.AddressInWhitelist(ctx, tx, address)
	if err != nil {
		logger.Error("failed to get address in whitelist", err, nil)
		return nil, internalError
	}

	freeCount := s.sequencer.Count(ctx, s.cfg.FileBunniesCollectionAddress, rarity)
	payedCount := s.sequencer.Count(ctx, s.cfg.FileBunniesCollectionAddress, "payed")
	return &models.WhitelistResponse{
		Whitelist: rarity,
		OrdersLeft: &models.WhitelistResponseOrdersLeft{
			Free:  freeCount,
			Payed: payedCount,
		},
	}, nil
}

func (s *service) GetWhitelistSignature(ctx context.Context, rarity string, address common.Address) (*models.WhitelistSignatureResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	whitelist, err := s.repository.AddressInWhitelist(ctx, tx, address)
	if err != nil {
		return nil, internalError
	}
	if whitelist != rarity {
		return nil, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "Address not whitelisted",
		}
	}

	var signer *ethsigner.EthSigner
	switch rarity {
	case "common":
		signer = s.commonSigner
	case "uncommon":
		signer = s.uncommonSigner
	default:
		logger.Warnf("invalid whitelist rarity: %s", rarity)
		return nil, internalError
	}

	signBytes, err := signer.SignAddress(address)
	if err != nil {
		return nil, internalError
	}
	signature := hex.EncodeToString(signBytes)

	return &models.WhitelistSignatureResponse{
		Signature: signature,
	}, nil
}
