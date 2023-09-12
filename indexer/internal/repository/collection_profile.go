package repository

import (
	"context"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"strings"
)

var (
	ErrProfileExist             = errors.New("profile with address already exists")
	ErrProfileNotUniqueSlug     = errors.New("slug is not unique")
	ErrProfileNotUniqueTwitter  = errors.New("twitter is not unique")
	ErrProfileNotUniqueDiscord  = errors.New("discord is not unique")
	ErrProfileNotUniqueTelegram = errors.New("telegram is not unique")
)

func (p *postgres) GetCollectionProfile(ctx context.Context, tx pgx.Tx, address common.Address) (*domain.CollectionProfile, error) {
	// language=PostgreSQL
	query := `
		SELECT slug, website_url, twitter, discord, telegram, banner_url
		FROM collection_profiles
		WHERE address=$1
	`
	var profile = domain.CollectionProfile{Address: address}
	var twitter, discord, telegram *string
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(
		&profile.Slug,
		&profile.WebsiteURL,
		&twitter,
		&discord,
		&telegram,
		&profile.BannerUrl,
	); err != nil {
		return nil, err
	}

	if twitter != nil {
		profile.Twitter = *twitter
	}
	if discord != nil {
		profile.Discord = *discord
	}
	if telegram != nil {
		profile.Telegram = *telegram
	}

	return &profile, nil
}

func (p *postgres) UpdateCollectionProfile(
	ctx context.Context,
	tx pgx.Tx,
	profile *domain.CollectionProfile,
) (*domain.CollectionProfile, error) {
	// language=PostgreSQL
	query := `
		UPDATE collection_profiles
		SET slug=$1, website_url=$2, twitter=$3, discord=$4, telegram=$5, banner_url=$6
		WHERE address=$7
		RETURNING slug, website_url, twitter, discord, telegram, banner_url
	`
	res := domain.CollectionProfile{
		Address: profile.Address,
	}
	var twitter, discord, telegram *string
	if err := tx.QueryRow(ctx, query,
		profile.Slug,
		profile.WebsiteURL,
		profile.Twitter,
		profile.Discord,
		profile.Telegram,
		profile.BannerUrl,
		strings.ToLower(profile.Address.String()),
	).Scan(
		&res.Slug,
		&res.WebsiteURL,
		&twitter,
		&discord,
		&telegram,
		&profile.BannerUrl,
	); err != nil {
		return nil, resolveCollectionProfileDBErr(err)
	}

	if twitter != nil {
		res.Twitter = *twitter
	}
	if discord != nil {
		res.Discord = *discord
	}
	if telegram != nil {
		profile.Telegram = *telegram
	}

	return &res, nil
}

func (p *postgres) InsertCollectionProfile(ctx context.Context, tx pgx.Tx, profile *domain.CollectionProfile) error {
	// language=PostgreSQL
	query := `
		INSERT INTO collection_profiles (address, slug, website_url, twitter, discord, telegram, banner_url)
		VALUES ($1,$2,$3,$4,$5,$6)
	`

	if _, err := tx.Exec(ctx, query,
		strings.ToLower(profile.Address.String()),
		strings.ToLower(profile.Slug),
		strings.ToLower(profile.WebsiteURL),
		profile.Twitter,
		profile.Discord,
		profile.Telegram,
		profile.BannerUrl,
	); err != nil {
		return resolveCollectionProfileDBErr(err)
	}

	return nil
}

func (p *postgres) CollectionProfileExists(ctx context.Context, tx pgx.Tx, address common.Address) (bool, error) {
	// language=PostgreSQL
	query := `
		SELECT EXISTS(		
			SELECT 1
			FROM collection_profiles
			WHERE address=$1
		)
	`
	var exist bool
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
	).Scan(&exist); err != nil {
		return false, err
	}

	return exist, nil
}

func resolveCollectionProfileDBErr(err error) error {
	if err == nil {
		return nil
	}

	if strings.Contains(err.Error(), "collection_profiles_slug_key") {
		return ErrProfileNotUniqueSlug
	} else if strings.Contains(err.Error(), "collection_profiles_discord_key") {
		return ErrProfileNotUniqueDiscord
	} else if strings.Contains(err.Error(), "collection_profiles_twitter_key") {
		return ErrProfileNotUniqueTwitter
	} else if strings.Contains(err.Error(), "collection_profiles_telegram_key") {
		return ErrProfileNotUniqueTelegram
	} else if strings.Contains(err.Error(), "collection_profiles_pkey") {
		return ErrProfileExist
	}

	return err
}
