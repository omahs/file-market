package service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/currencyconversion"
	"log"
	"math/big"
	"net/http"
	"strings"
)

func (s *service) AddEFTSubscription(ctx context.Context, w http.ResponseWriter, r *http.Request, req *models.EFTSubscriptionRequest) {
	collectionAddress := common.HexToAddress(req.CollectionAddress)
	tokenId, ok := big.NewInt(0).SetString(req.TokenID, 10)
	if !ok {
		log.Println("failed to parse token id in AddEFTSubscription")
	}

	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	order, err := s.repository.GetActiveOrder(ctx, tx, collectionAddress, tokenId)
	if err != nil {
		logger.Error("failed to get active order", err, nil)
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, collectionAddress, tokenId)
	if err != nil {
		logger.Error("failed to get active transfer", err, nil)
	}
	token, err := s.repository.GetToken(ctx, tx, collectionAddress, tokenId)
	if err != nil {
		logger.Error("failed to get token", err, nil)
		return
	}

	var isApproved bool
	if transfer != nil && len(transfer.Statuses) > 0 {
		isApproved = transfer.Statuses[len(transfer.Statuses)-1].Status == string(models.TransferStatusPasswordSet) ||
			transfer.Statuses[len(transfer.Statuses)-1].Status == string(models.TransferStatusFinished)
	}

	msg := domain.EFTSubMessage{
		Event:      "",
		IsApproved: isApproved,
		Token:      token,
		Transfer:   transfer,
		Order:      order,
	}

	if msg.Order != nil {
		currency := "FIL"
		if strings.Contains(s.cfg.Mode, "era") {
			currency = "ETH"
		}
		rate, err := s.currencyConverter.GetExchangeRate(context.Background(), currency, "USD")
		if err != nil {
			log.Println("failed to get conversion rate: ", err)
			rate = 0
		}

		msg.Order.PriceUsd = currencyconversion.Convert(rate, msg.Order.Price)
	}

	topic := fmt.Sprintf("%s:%s", strings.ToLower(collectionAddress.String()), tokenId.String())
	if err := s.wsPool.AddConnection(w, r, topic, domain.EFTSubMessageToModel(&msg)); err != nil {
		logger.Error("failed to add connection", err, nil)
		return
	}
}

func (s *service) AddBlockNumberSubscription(w http.ResponseWriter, r *http.Request) {
	if err := s.wsPool.AddConnection(w, r, "last_block", nil); err != nil {
		logger.Error("failed to add connection", err, nil)
		return
	}
}

func (s *service) SendEFTSubscriptionUpdate(collectionAddress common.Address, tokenId *big.Int, msg *domain.EFTSubMessage) {
	if msg.Order != nil {
		currency := "FIL"
		if strings.Contains(s.cfg.Mode, "era") {
			currency = "ETH"
		}

		rate, err := s.currencyConverter.GetExchangeRate(context.Background(), currency, "USD")
		if err != nil {
			log.Println("failed to get conversion rate: ", err)
			rate = 0
		}
		msg.Order.PriceUsd = currencyconversion.Convert(rate, msg.Order.Price)
	}

	topic := fmt.Sprintf("%s:%s", strings.ToLower(collectionAddress.String()), tokenId.String())
	s.wsPool.SendTopicSub(topic, msg)
}

func (s *service) SendBlockNumberSubscriptionUpdate(number *big.Int) {
	lastBlockMessage, err := json.Marshal(map[string]any{"last_block_number": number.Uint64()})
	if err != nil {
		logger.Error("failed to marshal last block number for broadcast: %v", err, nil)
		return
	}

	s.wsPool.SendTopicSub("last_block", lastBlockMessage)
}