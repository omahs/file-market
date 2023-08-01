package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
	"net/http"
)

func (s *service) ReportCollection(ctx context.Context, userAddress common.Address, req *models.ReportCollectionRequest) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	// for now only allowed addresses can submit report, later every wallet will be able to submit report and admins will review them
	isAllowedToReport, err := s.repository.IsAdmin(ctx, tx, userAddress)
	if err != nil {
		logger.Error("failed to get IsAdmin", err, nil)
		return internalError
	}
	if !isAllowedToReport {
		return &models.ErrorResponse{
			Code:    http.StatusForbidden,
			Message: "the address is not allowed to report collections",
		}
	}
	collectionAddress := common.HexToAddress(*req.CollectionAddress)
	if err := s.repository.ReportCollection(ctx, tx, collectionAddress, userAddress); err != nil {
		logger.Error("failed to report collection", err, nil)
		return internalError
	}

	return nil
}

func (s *service) ReportToken(ctx context.Context, userAddress common.Address, req *models.ReportTokenRequest) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	// for now only allowed addresses can submit report, later every wallet will be able to submit report and admins will review them
	isAllowedToReport, err := s.repository.IsAdmin(ctx, tx, userAddress)
	if err != nil {
		logger.Error("failed to get IsAdmin", err, nil)
		return internalError
	}
	if !isAllowedToReport {
		return &models.ErrorResponse{
			Code:    http.StatusForbidden,
			Message: "the address is not allowed to report token",
		}
	}
	collectionAddress := common.HexToAddress(*req.CollectionAddress)
	tokenId, ok := new(big.Int).SetString(*req.TokenID, 10)
	if !ok {
		return internalError
	}

	if err := s.repository.ReportToken(ctx, tx, collectionAddress, tokenId, userAddress); err != nil {
		logger.Error("failed to report token", err, nil)
		return internalError
	}

	return nil
}
