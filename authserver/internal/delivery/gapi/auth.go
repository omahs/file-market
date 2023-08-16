package gapi

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	authserver_pb "github.com/mark3d-xyz/mark3d/authserver/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"log"
	"strings"
)

type CtxKey string

const (
	authorizationHeader = "authorization"
	authorizationBearer = "bearer"

	CtxKeyUser = CtxKey("user")
)

func (s *GRPCServer) GetAuthMessage(ctx context.Context, request *authserver_pb.AuthMessageRequest) (*authserver_pb.AuthMessageResponse, error) {
	req := domain.AuthMessageRequest{
		Address: &request.Address,
	}

	if err := req.Validate(); err != nil {
		log.Printf("failed to validate auth message reques: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "failed to validate auth message request: %s", err.Error())
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	res, err := s.service.GetAuthMessage(ctx, common.HexToAddress(*req.Address))
	if err != nil {
		return nil, err.ToGRPC()
	}

	return res.ToGRPC(), nil
}

func (s *GRPCServer) GetUserByJwtToken(ctx context.Context, req *authserver_pb.GetUserByJwtTokenRequest) (*authserver_pb.User, error) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	user, err := s.service.GetUserByJwtToken(ctx, jwt.Purpose(req.Purpose), req.Token)
	if err != nil {
		return nil, err.ToGRPC()
	}

	return &authserver_pb.User{
		Address: strings.ToLower(user.Address.String()),
		Role:    int32(user.Role),
	}, nil
}

func (s *GRPCServer) AuthBySignature(ctx context.Context, request *authserver_pb.AuthBySignatureRequest) (*authserver_pb.AuthResponse, error) {
	req := domain.AuthBySignatureRequest{
		Address:   &request.Address,
		Signature: &request.Signature,
	}

	if err := req.Validate(); err != nil {
		log.Printf("failed to validate authBySignature request: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "failed to validate authBySignature request: %s", err.Error())
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	address := common.HexToAddress(*req.Address)
	authResp, err := s.service.AuthBySignature(ctx, address, *req.Signature)
	if err != nil {
		return nil, err.ToGRPC()
	}

	return authResp.ToGRPC(), nil
}

func (s *GRPCServer) RefreshTokens(ctx context.Context, _ *empty.Empty) (*authserver_pb.AuthResponse, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeRefresh)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	res, e := s.service.RefreshJwtTokens(ctx, user.Address, int64(user.Number))
	if e != nil {
		return nil, e.ToGRPC()
	}

	return res.ToGRPC(), nil
}

func (s *GRPCServer) Logout(ctx context.Context, _ *empty.Empty) (*authserver_pb.SuccessResponse, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if e := s.service.Logout(ctx, user.Address, int64(user.Number)); e != nil {
		return nil, e.ToGRPC()
	}

	return &authserver_pb.SuccessResponse{Success: true}, nil
}

func (s *GRPCServer) FullLogout(ctx context.Context, _ *empty.Empty) (*authserver_pb.SuccessResponse, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	if err := s.service.FullLogout(ctx, user.Address); err != nil {
		return nil, err.ToGRPC()
	}

	return &authserver_pb.SuccessResponse{Success: true}, nil
}

func (s *GRPCServer) CheckAuth(ctx context.Context, _ *empty.Empty) (*authserver_pb.UserProfile, error) {
	ctx, err := s.authorizeUser(ctx, jwt.PurposeAccess)
	if err != nil {
		return nil, err
	}

	user, ok := ctx.Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "unauthenticated")
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.RequestTimeout)
	defer cancel()

	profile, e := s.service.GetUserProfileByAddress(ctx, user.Address, true)
	if e != nil {
		return nil, e.ToGRPC()
	}

	return profile.ToGRPC(), nil
}

func (s *GRPCServer) authorizeUser(ctx context.Context, purpose jwt.Purpose) (context.Context, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, "missing metadata")
	}

	authValues := md.Get(authorizationHeader)
	if len(authValues) == 0 {
		return nil, status.Errorf(codes.InvalidArgument, "missing authorization header")
	}

	authHeader := authValues[0]
	fields := strings.Fields(authHeader)
	if len(fields) < 2 {
		return nil, status.Errorf(codes.InvalidArgument, "missing authorization header")
	}

	authType := strings.ToLower(fields[0])
	if authType != authorizationBearer {
		return nil, status.Errorf(codes.Unauthenticated, "unsupported authorization type")
	}

	token := fields[1]
	user, e := s.service.GetUserByJwtToken(ctx, purpose, token)
	if e != nil {
		return nil, e.ToGRPC()
	}

	ctx = context.WithValue(ctx, CtxKeyUser, user)

	return ctx, nil
}
