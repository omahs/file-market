package service

import (
	"context"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"net/http"
	"strings"
)

func (s *service) UpdateCollectionProfile(
	ctx context.Context,
	owner common.Address,
	req *models.UpdateCollectionProfileRequest,
) (*models.UpdateCollectionProfileResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	address := common.HexToAddress(*req.Address)

	isOwner, err := s.repository.IsCollectionOwner(ctx, tx, owner, address)
	if err != nil {
		logger.Error("failed to call IsCollectionOwner", err, nil)
		return nil, internalError
	}

	if !isOwner {
		return nil, &models.ErrorResponse{
			Code:    http.StatusForbidden,
			Message: "not owner of the collection",
		}
	}

	profileExists := true
	profile, err := s.repository.GetCollectionProfile(ctx, tx, address)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		if errors.Is(err, pgx.ErrNoRows) {
			profileExists = false
		} else {
			logger.Error("failed to call CollectionProfileExists", err, nil)
			return nil, internalError
		}
	}

	if profileExists {
		updateCollectionProfileFields(profile, req)
		res, err := s.repository.UpdateCollectionProfile(ctx, tx, profile)
		if err != nil {
			logger.Error("failed to update collection profile", err, nil)
			return nil, internalError
		}

		return &models.UpdateCollectionProfileResponse{
			Address:    strings.ToLower(res.Address.String()),
			Discord:    res.Discord,
			Slug:       res.Slug,
			Twitter:    res.Twitter,
			Telegram:   res.Telegram,
			WebsiteURL: res.WebsiteURL,
			BannerURL:  res.BannerUrl,
		}, nil
	}

	// Update
	profile = &domain.CollectionProfile{
		Address:    address,
		Slug:       req.Slug,
		WebsiteURL: req.WebsiteURL,
		Twitter:    req.Twitter,
		Telegram:   req.Telegram,
		Discord:    req.Discord,
		BannerUrl:  req.BannerURL,
	}
	if err := s.repository.InsertCollectionProfile(ctx, tx, profile); err != nil {
		logger.Error("failed to insert collection profile", err, nil)
		return nil, internalError
	}

	return &models.UpdateCollectionProfileResponse{
		Address:    strings.ToLower(address.String()),
		Discord:    profile.Discord,
		Slug:       profile.Slug,
		Twitter:    profile.Twitter,
		Telegram:   profile.Telegram,
		WebsiteURL: profile.WebsiteURL,
		BannerURL:  profile.BannerUrl,
	}, nil
}

func updateCollectionProfileFields(profile *domain.CollectionProfile, req *models.UpdateCollectionProfileRequest) {
	if req.Slug != "" {
		profile.Slug = req.Slug
	}

	if req.WebsiteURL != "" {
		profile.WebsiteURL = req.WebsiteURL
	}

	if req.BannerURL != "" {
		profile.BannerUrl = req.BannerURL
	}
}
