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
		logger.Error("failed to call GetUserProfile", err, nil)
		return nil, grpcErrToHTTP(err)
	}

	profile := models.UserProfile{
		Address:                    res.Address,
		AvatarURL:                  res.AvatarURL,
		BannerURL:                  res.BannerURL,
		Bio:                        res.Bio,
		Name:                       res.Name,
		Twitter:                    res.Twitter,
		Discord:                    res.Discord,
		Telegram:                   res.Telegram,
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
		AvatarURL:                  p.AvatarURL,
		BannerURL:                  p.BannerURL,
		Bio:                        p.Bio,
		Name:                       p.Name,
		Username:                   p.Username,
		WebsiteURL:                 p.WebsiteURL,
		IsEmailNotificationEnabled: p.IsEmailNotificationEnabled,
		IsPushNotificationEnabled:  p.IsPushNotificationEnabled,
		Twitter:                    p.Twitter,
		Discord:                    p.Discord,
		Telegram:                   p.Telegram,
	}

	res, err := s.authClient.UpdateUserProfile(ctx, &arg)
	if err != nil {
		logger.Error("failed to call UpdateUserProfile", err, nil)
		return nil, grpcErrToHTTP(err)
	}

	profile := models.UserProfile{
		Address:                    res.Address,
		AvatarURL:                  res.AvatarURL,
		BannerURL:                  res.BannerURL,
		Bio:                        res.Bio,
		Discord:                    res.Discord,
		Email:                      res.Email,
		IsEmailNotificationEnabled: res.IsEmailNotificationEnabled,
		IsPushNotificationEnabled:  res.IsPushNotificationEnabled,
		Name:                       res.Name,
		Telegram:                   res.Telegram,
		Twitter:                    res.Twitter,
		Username:                   res.Username,
		WebsiteURL:                 res.WebsiteURL,
	}

	return &profile, nil
}

func (s *service) SetEmail(ctx context.Context, email string) *models.ErrorResponse {
	res, err := s.authClient.SetEmail(ctx, &authserver_pb.SetEmailRequest{Email: email})
	if err != nil {
		logger.Error("failed to call SetEmail", err, nil)
		return grpcErrToHTTP(err)
	}

	name := res.Profile.Name
	if name == "" {
		name = res.Profile.Address
	}
	data := emailVerificationTemplateParams{
		Name:               name,
		VerifyUrl:          fmt.Sprintf("%s/api/profile/verify_email?secret_token=%s", s.cfg.Host, res.Token),
		ProfileSettingsUrl: fmt.Sprintf("%s/profile/%s", s.cfg.Host, res.Profile.Address),
		BottomFilename:     "bottompng",
		LogoFilename:       "logopng",
	}
	if err := s.sendEmail(
		"email_verify",
		res.Email,
		"Email Verification",
		"verification",
		data,
	); err != nil {
		logger.Error("failed to send verification email", err, nil)
		return internalError
	}

	return nil
}

func (s *service) VerifyEmail(ctx context.Context, secretToken string) (string, *models.ErrorResponse) {
	res, err := s.authClient.VerifyEmail(ctx, &authserver_pb.VerifyEmailRequest{SecretToken: secretToken})
	if err != nil {
		logger.Error("failed to call VerifyEmail", err, nil)
		return "", grpcErrToHTTP(err)
	}

	link := fmt.Sprintf("%s/profile/%s", s.cfg.Host, res.Address)

	return link, nil
}
