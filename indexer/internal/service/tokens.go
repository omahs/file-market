package service

import (
	"context"
	"errors"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	. "github.com/mark3d-xyz/mark3d/indexer/pkg/types"
)

func (s *service) GetToken(ctx context.Context, address common.Address,
	tokenId *big.Int) (*models.Token, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	token, err := s.repository.GetToken(ctx, tx, address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get token failed: ", err)
		return nil, internalError
	}

	return domain.TokenToModel(token), nil
}

func (s *service) GetTokenEncryptedPassword(
	ctx context.Context,
	address common.Address,
	tokenId *big.Int,
) (*models.EncryptedPasswordResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	pwd, number, err := s.repository.GetTokenEncryptedPassword(ctx, tx, address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get token password failed: ", err)
		return nil, internalError
	}

	res := models.EncryptedPasswordResponse{
		EncryptedPassword: pwd,
		DealNumber:        number,
	}

	return &res, nil
}

func (s *service) GetCollectionTokens(
	ctx context.Context,
	address common.Address,
	lastTokenId *big.Int,
	limit int,
) (*models.TokensByCollectionResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	tokens, err := s.repository.GetCollectionTokens(ctx, tx, address, lastTokenId, limit)
	if err != nil {
		log.Println("get collection tokens failed: ", err)
		return nil, internalError
	}
	total, err := s.repository.GetCollectionTokensTotal(ctx, tx, address)
	if err != nil {
		log.Println("get collection tokens total failed: ", err)
		return nil, internalError
	}
	return &models.TokensByCollectionResponse{
		Tokens: domain.MapSlice(tokens, domain.TokenToModel),
		Total:  total,
	}, nil
}

func (s *service) GetTokensByAddress(
	ctx context.Context,
	address common.Address,
	lastCollectionAddress *common.Address,
	collectionLimit int,
	lastTokenCollectionAddress *common.Address,
	lastTokenId *big.Int,
	tokenLimit int,
) (*models.TokensResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	collections, err := s.repository.GetCollectionsByOwnerAddress(ctx, tx, address, lastCollectionAddress, collectionLimit)
	if err != nil {
		log.Println("get collections by address failed: ", err)
		return nil, internalError
	}
	collectionsTotal, err := s.repository.GetCollectionsByOwnerAddressTotal(ctx, tx, address)
	if err != nil {
		log.Println("get collections total by address failed: ", err)
		return nil, internalError
	}

	tokens, err := s.repository.GetTokensByAddress(ctx, tx, address, lastTokenCollectionAddress, lastTokenId, tokenLimit)
	if err != nil {
		log.Println("get tokens by address failed: ", err)
		return nil, internalError
	}
	tokensTotal, err := s.repository.GetTokensByAddressTotal(ctx, tx, address)
	if err != nil {
		log.Println("get tokens by address total failed: ", err)
		return nil, internalError
	}

	tokensRes := domain.MapSlice(tokens, domain.TokenToModel)
	for i, t := range tokens {
		transfer, err := s.repository.GetActiveTransfer(ctx, tx, t.CollectionAddress, t.TokenId)
		if err != nil {
			if err == pgx.ErrNoRows {
				continue
			}
			log.Println("get token active transfer failed: ", err)
			return nil, internalError
		}
		tokensRes[i].PendingTransferID, tokensRes[i].PendingOrderID = transfer.Id, transfer.OrderId
	}

	collectionsRes := make([]*models.Collection, len(collections))
	for i, c := range collections {
		res := domain.CollectionToModel(c)
		fileTypes, categories, subcategories, err := s.repository.GetTokensContentTypeByCollection(ctx, tx, c.Address)
		if err != nil {
			logger.Errorf("failed to get collection content types", err, nil)
			return nil, internalError
		}

		res.ContentTypes = &models.CollectionContentTypes{
			Categories:     categories,
			FileExtensions: fileTypes,
			Subcategories:  subcategories,
		}
		res.ChainID = s.cfg.ChainID

		if c.Address == s.cfg.FileBunniesCollectionAddress {
			stats, err := s.repository.GetFileBunniesStats(ctx, tx)
			if err != nil {
				logger.Errorf("failed to get stats", err, nil)
				return nil, internalError
			}
			for _, s := range stats {
				res.Stats = append(res.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
			}
		}
		collectionsRes[i] = res
	}
	return &models.TokensResponse{
		Collections:      collectionsRes,
		CollectionsTotal: collectionsTotal,
		Tokens:           tokensRes,
		TokensTotal:      tokensTotal,
	}, nil
}

func (s *service) GetFileBunniesTokensForAutosell(ctx context.Context) ([]AutosellTokenInfo, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	tokensInfo, err := s.repository.GetTokensForAutosell(ctx, tx, s.cfg.FileBunniesCollectionAddress, s.cfg.FileBunniesCreatorAddress)
	if err != nil {
		logger.Error("failed to get tokens for autosell", err, nil)
		return nil, internalError
	}

	return tokensInfo, nil
}

func (s *service) getTokenCurrentState(ctx context.Context, address common.Address, tokenId *big.Int) (*domain.Token, *domain.Transfer, *domain.Order, error) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		logger.Error("failed to begin db tx", err, nil)
		return nil, nil, nil, err
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	token, err := s.repository.GetToken(ctx, tx, address, tokenId)
	if err != nil {
		logger.Error("failed to get token", err, nil)
		return nil, nil, nil, err
	}
	order, err := s.repository.GetActiveOrder(ctx, tx, address, tokenId)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		logger.Error("failed to get active order", err, nil)
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, address, tokenId)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		logger.Error("failed to get active transfer", err, nil)
	}

	if err := tx.Commit(ctx); err != nil {
		logger.Error("failed to commit db tx", err, nil)
		return nil, nil, nil, err
	}

	return token, transfer, order, nil
}
