package service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service/subscription"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/currencyconversion"
	"log"
	"math/big"
	"strings"
)

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

	b, err := json.Marshal(domain.EFTSubMessageToModel(msg))
	if err != nil {
		logger.Error("failed to marshal EFTSubMessage", err, nil)
	}

	topic := fmt.Sprintf(subscription.EFTSubTopicFormat, strings.ToLower(collectionAddress.String()), tokenId.String())
	s.subscriptionService.BroadcastMessage(topic, b)
}
func (s *service) SendBlockNumberSubscriptionUpdate(number *big.Int) {
	lastBlockMessage, err := json.Marshal(map[string]any{"last_block_number": number.Uint64()})
	if err != nil {
		logger.Warnf("failed to marshal last block number for broadcast: %v", err)
	}
	s.subscriptionService.BroadcastMessage(subscription.LastBlockNumberTopic, lastBlockMessage)
}
