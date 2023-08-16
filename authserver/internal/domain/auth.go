package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/validator"
	authserver_pb "github.com/mark3d-xyz/mark3d/authserver/proto"
	"time"
)

type Principal struct {
	Address common.Address
	Role    UserRole
	Number  int
}

type AuthMessage struct {
	Address   common.Address
	Message   string
	CreatedAt time.Time
}

type AuthResponse struct {
	AccessToken  *JwtTokenInfo `json:"access_token,omitempty"`
	Profile      *UserProfile  `json:"profile,omitempty"`
	RefreshToken *JwtTokenInfo `json:"refresh_token,omitempty"`
}

func (r *AuthResponse) ToGRPC() *authserver_pb.AuthResponse {
	accessToken := r.AccessToken.ToGRPC()
	refreshToken := r.RefreshToken.ToGRPC()
	profile := r.Profile.ToGRPC()

	return &authserver_pb.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Profile:      profile,
	}
}

type JwtTokenInfo struct {
	ExpiresAt *int64  `json:"expires_at"`
	Token     *string `json:"token"`
}

func (i *JwtTokenInfo) ToGRPC() *authserver_pb.JwtTokenInfo {
	if i == nil || i.Token == nil || i.ExpiresAt == nil {
		return nil
	}

	return &authserver_pb.JwtTokenInfo{
		ExpiresAt: *i.ExpiresAt,
		Token:     *i.Token,
	}
}

type AuthMessageRequest struct {
	Address *string `json:"address"`
}

func (r *AuthMessageRequest) Validate() error {
	return validator.ValidateAddress(r.Address)
}

type AuthMessageResponse struct {
	Message string `json:"message"`
}

func (r *AuthMessageResponse) ToGRPC() *authserver_pb.AuthMessageResponse {
	if r == nil {
		return nil
	}

	return &authserver_pb.AuthMessageResponse{Message: r.Message}
}

type AuthBySignatureRequest struct {
	Address   *string `json:"address"`
	Signature *string `json:"signature"`
}

func (r *AuthBySignatureRequest) Validate() error {
	errs := make([]error, 0)

	if err := validator.ValidateAddress(r.Address); err != nil {
		errs = append(errs, err)
	}

	if err := validator.ValidateRequiredString(r.Signature, "signature"); err != nil {
		errs = append(errs, err)
	}

	if len(errs) > 0 {
		return validator.CompositeError(errs...)
	}
	return nil
}

type EmailVerificationToken struct {
	Address   common.Address
	Email     string
	Token     string
	CreatedAt time.Time
}
