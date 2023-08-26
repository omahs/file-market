package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/jwt"
	authserver_pb "github.com/mark3d-xyz/mark3d/indexer/proto"
)

func (s *service) AuthBySignature(ctx context.Context, req models.AuthBySignatureRequest) (*models.AuthResponse, *models.ErrorResponse) {
	res, err := s.authClient.AuthBySignature(ctx, &authserver_pb.AuthBySignatureRequest{
		Address:   *req.Address,
		Signature: *req.Signature,
	})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	accessToken := models.JwtTokenInfo{
		ExpiresAt: &res.AccessToken.ExpiresAt,
		Token:     &res.AccessToken.Token,
	}
	refreshToken := models.JwtTokenInfo{
		ExpiresAt: &res.RefreshToken.ExpiresAt,
		Token:     &res.RefreshToken.Token,
	}
	profile := models.UserProfile{
		AvatarURL:  res.Profile.AvatarURL,
		BannerURL:  res.Profile.BannerURL,
		Bio:        res.Profile.Bio,
		Email:      res.Profile.Email,
		Name:       res.Profile.Name,
		Twitter:    res.Profile.Twitter,
		Username:   res.Profile.Username,
		WebsiteURL: res.Profile.WebsiteURL,
	}

	return &models.AuthResponse{
		AccessToken:  &accessToken,
		RefreshToken: &refreshToken,
		Profile:      &profile,
	}, nil
}

func (s *service) GetAuthMessage(ctx context.Context, req models.AuthMessageRequest) (*models.AuthMessageResponse, *models.ErrorResponse) {
	res, err := s.authClient.GetAuthMessage(ctx, &authserver_pb.AuthMessageRequest{
		Address: *req.Address,
	})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.AuthMessageResponse{Message: &res.Message}, nil
}

func (s *service) RefreshJwtTokens(ctx context.Context) (*models.AuthResponse, *models.ErrorResponse) {
	res, err := s.authClient.RefreshTokens(ctx, &empty.Empty{})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	accessToken := models.JwtTokenInfo{
		ExpiresAt: &res.AccessToken.ExpiresAt,
		Token:     &res.AccessToken.Token,
	}
	refreshToken := models.JwtTokenInfo{
		ExpiresAt: &res.RefreshToken.ExpiresAt,
		Token:     &res.RefreshToken.Token,
	}
	profile := models.UserProfile{
		AvatarURL:  res.Profile.AvatarURL,
		BannerURL:  res.Profile.BannerURL,
		Bio:        res.Profile.Bio,
		Email:      res.Profile.Email,
		Name:       res.Profile.Name,
		Twitter:    res.Profile.Twitter,
		Username:   res.Profile.Username,
		WebsiteURL: res.Profile.WebsiteURL,
	}

	return &models.AuthResponse{
		AccessToken:  &accessToken,
		RefreshToken: &refreshToken,
		Profile:      &profile,
	}, nil

}

func (s *service) GetUserByJwtToken(ctx context.Context, purpose jwt.Purpose, token string) (*domain.User, *models.ErrorResponse) {
	res, err := s.authClient.GetUserByJwtToken(ctx, &authserver_pb.GetUserByJwtTokenRequest{
		Purpose: int32(purpose),
		Token:   token,
	})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &domain.User{
		Address: common.HexToAddress(res.Address),
		Role:    domain.UserRole(res.Role),
	}, nil
}

func (s *service) Logout(ctx context.Context) (*models.SuccessResponse, *models.ErrorResponse) {
	res, err := s.authClient.Logout(ctx, &empty.Empty{})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.SuccessResponse{Success: &res.Success}, nil
}

func (s *service) FullLogout(ctx context.Context) (*models.SuccessResponse, *models.ErrorResponse) {
	res, err := s.authClient.FullLogout(ctx, &empty.Empty{})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	return &models.SuccessResponse{Success: &res.Success}, nil
}

func (s *service) CheckAuth(ctx context.Context) (*models.UserProfile, *models.ErrorResponse) {
	res, err := s.authClient.CheckAuth(ctx, &empty.Empty{})
	if err != nil {
		return nil, GRPCErrToHTTP(err)
	}

	profile := models.UserProfile{
		Address:                    res.Address,
		AvatarURL:                  res.AvatarURL,
		BannerURL:                  res.BannerURL,
		Bio:                        res.Bio,
		Email:                      res.Email,
		Name:                       res.Name,
		Twitter:                    res.Twitter,
		Username:                   res.Username,
		WebsiteURL:                 res.WebsiteURL,
		IsEmailNotificationEnabled: res.IsEmailNotificationEnabled,
		IsPushNotificationEnabled:  res.IsPushNotificationEnabled,
	}

	return &profile, nil
}
