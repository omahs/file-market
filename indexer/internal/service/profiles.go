package service

import (
	"context"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	authserver_pb "github.com/mark3d-xyz/mark3d/indexer/proto"
)

func (s *service) GetUserProfile(ctx context.Context, identification string) (*models.UserProfile, *models.ErrorResponse) {
	res, err := s.authClient.GetUserProfile(ctx, &authserver_pb.GetUserProfileRequest{
		Identification: identification,
	})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	profile := models.UserProfile{
		AvatarURL:  res.AvatarURL,
		BannerURL:  res.BannerURL,
		Bio:        res.Bio,
		Email:      res.Email,
		Name:       res.Name,
		Twitter:    res.Twitter,
		Username:   res.Username,
		WebsiteURL: res.WebsiteURL,
	}

	return &profile, nil
}

func (s *service) UpdateUserProfile(ctx context.Context, p *models.UserProfile) (*models.UserProfile, *models.ErrorResponse) {
	arg := authserver_pb.UserProfile{
		AvatarURL:  p.AvatarURL,
		BannerURL:  p.BannerURL,
		Bio:        p.Bio,
		Name:       p.Name,
		Username:   p.Username,
		WebsiteURL: p.WebsiteURL,
	}

	res, err := s.authClient.UpdateUserProfile(ctx, &arg)
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	profile := models.UserProfile{
		AvatarURL:  res.AvatarURL,
		BannerURL:  res.BannerURL,
		Bio:        res.Bio,
		Email:      res.Email,
		Name:       res.Name,
		Twitter:    res.Twitter,
		Username:   res.Username,
		WebsiteURL: res.WebsiteURL,
	}

	return &profile, nil
}

func (s *service) SetEmail(ctx context.Context, email string) (*models.SuccessResponse, *models.ErrorResponse) {
	res, err := s.authClient.SetEmail(ctx, &authserver_pb.SetEmailRequest{Email: email})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.SuccessResponse{Success: &res.Success}, nil
}

func (s *service) VerifyEmail(ctx context.Context, secretToken string) (*models.SuccessResponse, *models.ErrorResponse) {
	res, err := s.authClient.VerifyEmail(ctx, &authserver_pb.VerifyEmailRequest{SecretToken: secretToken})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.SuccessResponse{Success: &res.Success}, nil
}
