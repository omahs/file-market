package service

import (
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service/subscription"
	"math/big"
	"strings"
)

func (s *service) SendEFTSubscriptionUpdate(collectionAddress common.Address, tokenId *big.Int, msg *domain.EFTSubMessage) {
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
