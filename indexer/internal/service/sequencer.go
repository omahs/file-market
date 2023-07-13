package service

import (
	"context"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/sequencer"
	"log"
	"math/big"
)

func (s *service) SequencerAcquire(ctx context.Context, address common.Address, suffix string, wallet common.Address) (*models.SequencerAcquireResponse, *models.ErrorResponse) {
	tokenId, err := s.sequencer.Acquire(ctx, address, suffix, wallet)
	if err != nil {
		if errors.Is(err, sequencer.EmptySetErr) {
			return &models.SequencerAcquireResponse{IsSetEmpty: true}, nil
		}

		log.Println("Acquire tokenId failed: ", err)
		return nil, internalError
	}
	return &models.SequencerAcquireResponse{
		TokenID: big.NewInt(tokenId).String(),
	}, nil
}
