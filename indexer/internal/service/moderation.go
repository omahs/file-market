package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
	"net/http"
)

func (s *service) ReportCollection(ctx context.Context, user *domain.User, req *models.ReportCollectionRequest) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	// for now only allowed addresses can submit report, later every wallet will be able to submit report and admins will review them
	if user.Role != domain.UserRoleAdmin {
		return &models.ErrorResponse{
			Code:    http.StatusForbidden,
			Message: "the address is not allowed to report collections",
		}
	}
	collectionAddress := common.HexToAddress(*req.CollectionAddress)
	if err := s.repository.ReportCollection(ctx, tx, collectionAddress, user.Address); err != nil {
		logger.Error("failed to report collection", err, nil)
		return internalError
	}

	if err := tx.Commit(ctx); err != nil {
		logger.Error("failed to commit tx", err, nil)
		return internalError
	}

	return nil
}

func (s *service) ReportToken(ctx context.Context, user *domain.User, req *models.ReportTokenRequest) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	// for now only allowed addresses can submit report, later every wallet will be able to submit report and admins will review them
	if user.Role != domain.UserRoleAdmin {
		return &models.ErrorResponse{
			Code:    http.StatusForbidden,
			Message: "the address is not allowed to report token",
		}
	}
	collectionAddress := common.HexToAddress(*req.CollectionAddress)
	tokenId, ok := new(big.Int).SetString(*req.TokenID, 10)
	if !ok {
		logger.Error("failed to cast tokenId", err, nil)
		return internalError
	}

	if err := s.repository.ReportToken(ctx, tx, collectionAddress, tokenId, user.Address); err != nil {
		logger.Error("failed to report token", err, nil)
		return internalError
	}

	if err := tx.Commit(ctx); err != nil {
		logger.Error("failed to commit tx", err, nil)
		return internalError
	}

	return nil
}
