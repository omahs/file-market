package service

import (
	"context"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"strings"
)

func (s *service) GetCurrencyConversionRate(ctx context.Context, to string) (*models.ConversionRateResponse, *models.ErrorResponse) {
	from := "FIL"
	if strings.HasPrefix(s.cfg.Mode, "era") {
		from = "ETH"
	}
	rate, err := s.currencyConverter.GetExchangeRate(ctx, from, to)
	if err != nil {
		log.Println("failed to get conversion rate: ", err)
		return nil, internalError
	}

	return &models.ConversionRateResponse{
		From: from,
		To:   to,
		Rate: rate,
	}, nil
}
