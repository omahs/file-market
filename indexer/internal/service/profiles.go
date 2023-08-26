package service

import (
	"context"
	"fmt"
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
		Address:                    res.Address,
		AvatarURL:                  res.AvatarURL,
		BannerURL:                  res.BannerURL,
		Bio:                        res.Bio,
		Name:                       res.Name,
		Twitter:                    res.Twitter,
		Discord:                    res.Discord,
		Username:                   res.Username,
		WebsiteURL:                 res.WebsiteURL,
		Email:                      "",    // private
		IsPushNotificationEnabled:  false, // private
		IsEmailNotificationEnabled: false, // private
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
		Discord:    res.Discord,
		Username:   res.Username,
		WebsiteURL: res.WebsiteURL,
	}

	return &profile, nil
}

func (s *service) SetEmail(ctx context.Context, email string) *models.ErrorResponse {
	res, err := s.authClient.SetEmail(ctx, &authserver_pb.SetEmailRequest{Email: email})
	if err != nil {
		return GRPCErrToHTTP(err)
	}

	contentTemplate := `
		<h1>Filemarket Email Verification</h1>
		<a href="%s">Click to verify email on Filemarket.xyz</a>
	`
	link := fmt.Sprintf("%s/api/profile/verify_email?secret_token=%s", s.cfg.Host, res.Token) // https://filemarket.xyz

	if err := s.emailSender.SendEmail(
		"Email Verification",
		fmt.Sprintf(contentTemplate, link),
		"verification",
		[]string{res.Email},
		nil,
		nil,
	); err != nil {
		logger.Error("failed to send verification email", err, nil)
		return internalError
	}

	return nil
}

func (s *service) VerifyEmail(ctx context.Context, secretToken string) (*models.SuccessResponse, *models.ErrorResponse) {
	res, err := s.authClient.VerifyEmail(ctx, &authserver_pb.VerifyEmailRequest{SecretToken: secretToken})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.SuccessResponse{Success: &res.Success}, nil
}
