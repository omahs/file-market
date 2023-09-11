package service

import (
	"context"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
)

func (s *service) GetCollection(
	ctx context.Context,
	address common.Address,
) (*models.CollectionResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	collection, err := s.repository.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get collection failed: ", err)
		return nil, internalError
	}

	c := domain.CollectionToModel(collection)
	fileTypes, categories, subcategories, err := s.repository.GetTokensContentTypeByCollection(ctx, tx, address)
	if err != nil {
		logger.Errorf("failed to get collection content types", err, nil)
		return nil, internalError
	}

	c.ContentTypes = &models.CollectionContentTypes{
		Categories:     categories,
		FileExtensions: fileTypes,
		Subcategories:  subcategories,
	}

	if collection.Address == s.cfg.FileBunniesCollectionAddress {
		stats, err := s.repository.GetFileBunniesStats(ctx, tx)
		if err != nil {
			logger.Errorf("failed to get stats", err, nil)
			return nil, internalError
		}
		for _, s := range stats {
			c.Stats = append(c.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
		}
	}

	res := models.CollectionResponse{
		Collection: c,
		Discord:    "",
		Slug:       "",
		Twitter:    "",
		WebsiteURL: "",
	}

	profile, err := s.repository.GetCollectionProfile(ctx, tx, address)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			logger.Error("failed to get collection profile", err, nil)
		}
	} else {
		res.Slug = profile.Slug
		res.WebsiteURL = profile.WebsiteURL
		res.Twitter = profile.Twitter
		res.Discord = profile.Discord
		res.BannerURL = profile.BannerUrl
	}

	return &res, nil
}

func (s *service) GetCollections(
	ctx context.Context,
	lastCollectionAddress *common.Address,
	limit int,
) (*models.CollectionsResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		logger.Errorf("begin tx failed", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	collections, err := s.repository.GetCollections(ctx, tx, lastCollectionAddress, limit)
	if err != nil {
		logger.Errorf("get collections failed", err)
		return nil, internalError
	}
	total, err := s.repository.GetCollectionsTotal(ctx, tx)
	if err != nil {
		logger.Errorf("get collections total failed", err)
		return nil, internalError
	}

	modelsCollections := make([]*models.Collection, len(collections))
	for i, collection := range collections {
		c := domain.CollectionToModel(collection)
		fileTypes, categories, subcategories, err := s.repository.GetTokensContentTypeByCollection(ctx, tx, collection.Address)
		if err != nil {
			logger.Error("failed to get collection content types", err, nil)
			return nil, internalError
		}
		c.ContentTypes = &models.CollectionContentTypes{
			Categories:     categories,
			FileExtensions: fileTypes,
			Subcategories:  subcategories,
		}

		if collection.Address == s.cfg.FileBunniesCollectionAddress {
			stats, err := s.repository.GetFileBunniesStats(ctx, tx)
			if err != nil {
				logger.Errorf("failed to get stats", err, nil)
				return nil, internalError
			}
			for _, s := range stats {
				c.Stats = append(c.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
			}
		}
		modelsCollections[i] = c
	}

	return &models.CollectionsResponse{
		Collections: modelsCollections,
		Total:       total,
	}, nil
}

func (s *service) GetCollectionWithTokens(
	ctx context.Context,
	address common.Address,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	collection, err := s.repository.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get collection failed: ", err)
		return nil, internalError
	}
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

	c := domain.CollectionToModel(collection)
	fileTypes, categories, subcategories, err := s.repository.GetTokensContentTypeByCollection(ctx, tx, address)
	if err != nil {
		logger.Errorf("failed to get collection content types", err, nil)
		return nil, internalError
	}

	c.ContentTypes = &models.CollectionContentTypes{
		Categories:     categories,
		FileExtensions: fileTypes,
		Subcategories:  subcategories,
	}

	if collection.Address == s.cfg.FileBunniesCollectionAddress {
		stats, err := s.repository.GetFileBunniesStats(ctx, tx)
		if err != nil {
			logger.Errorf("failed to get stats", err, nil)
			return nil, internalError
		}
		for _, s := range stats {
			c.Stats = append(c.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
		}
	}
	return &models.CollectionData{
		Collection: c,
		Tokens:     domain.MapSlice(tokens, domain.TokenToModel),
		Total:      total,
	}, nil
}

func (s *service) GetPublicCollectionWithTokens(
	ctx context.Context,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	return s.GetCollectionWithTokens(ctx, s.cfg.PublicCollectionAddress, lastTokenId, limit)
}

func (s *service) GetFileBunniesCollectionWithTokens(
	ctx context.Context,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	return s.GetCollectionWithTokens(ctx, s.cfg.FileBunniesCollectionAddress, lastTokenId, limit)
}
