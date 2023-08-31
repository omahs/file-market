package gapi

import (
	"context"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	authserver_pb "github.com/mark3d-xyz/mark3d/authserver/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
)

func (s *GRPCServer) GetUserProfile(ctx context.Context, req *authserver_pb.GetUserProfileRequest) (*authserver_pb.UserProfile, error) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	_, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	isPrincipal := err == nil
	profile, e := s.service.GetProfileByIdentification(ctx, req.Identification, isPrincipal)
	if e != nil {
		return nil, e.ToGRPC()
	}

	return profile.ToGRPC(), nil
}

func (s *GRPCServer) UpdateUserProfile(ctx context.Context, req *authserver_pb.UserProfile) (*authserver_pb.UserProfile, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	profile := domain.UserProfile{
		Address:                     user.Address,
		AvatarURL:                   req.AvatarURL,
		BannerURL:                   req.BannerURL,
		Bio:                         req.Bio,
		Name:                        req.Name,
		Username:                    req.Username,
		WebsiteURL:                  req.WebsiteURL,
		Twitter:                     &req.Twitter,
		Discord:                     &req.Discord,
		Telegram:                    &req.Telegram,
		IsEmailNotificationsEnabled: req.IsEmailNotificationEnabled,
		IsPushNotificationsEnabled:  req.IsPushNotificationEnabled,
	}

	if err := profile.ValidateForUpdate(); err != nil {
		log.Printf("failed to validate auth message reques: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "failed to validate auth message request: %s", err.Error())
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	res, e := s.service.UpdateUserProfile(ctx, &profile)
	if e != nil {
		return nil, e.ToGRPC()
	}

	return res.ToGRPC(), nil
}

func (s *GRPCServer) SetEmail(ctx context.Context, req *authserver_pb.SetEmailRequest) (*authserver_pb.SetEmailResponse, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	r := domain.SetEmailRequest{
		Email: req.Email,
	}
	if err := r.Validate(); err != nil {
		log.Printf("failed to validate email verification request: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "failed to validate email verification request: %s", err.Error())
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	res, e := s.service.SetEmail(ctx, user.Address, r.Email)
	if e != nil {
		return nil, e.ToGRPC()
	}

	return &authserver_pb.SetEmailResponse{
		Token:   res.Token,
		Email:   res.Email,
		Profile: res.Profile.ToGRPC(),
	}, nil
}

func (s *GRPCServer) VerifyEmail(ctx context.Context, req *authserver_pb.VerifyEmailRequest) (*authserver_pb.VerifyEmailResponse, error) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	address, err := s.service.VerifyEmail(ctx, req.SecretToken)
	if err != nil {
		return nil, err.ToGRPC()
	}

	return &authserver_pb.VerifyEmailResponse{Address: address}, nil
}
