package service

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"github.com/mark3d-xyz/mark3d/authserver/internal/repository"
	"github.com/mark3d-xyz/mark3d/authserver/internal/utils"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/now"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	authMessage = "Hello, %s! Please, sign this message with random param %s to sign in into FileMarket"
)

func (s *service) GetAuthMessage(ctx context.Context, address common.Address) (*domain.AuthMessageResponse, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	msg, err := s.repository.GetAuthMessage(ctx, tx, address)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		log.Printf("failed to get auth message: %v\n", err)
		return nil, domain.InternalError
	}
	if msg != nil {
		if time.Since(msg.CreatedAt) < s.cfg.AuthMessageTTL {
			return &domain.AuthMessageResponse{
				Message: msg.Message,
			}, nil
		}
	}

	// msg not found or expired
	if err := s.repository.DeleteAuthMessage(ctx, tx, address); err != nil {
		log.Printf("failed to delete auth message: %v", err)
		return nil, domain.InternalError
	}

	newMsg := generateAuthMessage(address)
	if err := s.repository.InsertAuthMessage(ctx, tx, domain.AuthMessage{
		Address:   address,
		Message:   newMsg,
		CreatedAt: time.Now(),
	}); err != nil {
		log.Printf("failed to insert new auth message: %v", err)
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	return &domain.AuthMessageResponse{
		Message: newMsg,
	}, nil
}

func (s *service) AuthBySignature(ctx context.Context, address common.Address, signature string) (*domain.AuthResponse, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	msg, err := s.repository.GetAuthMessage(ctx, tx, address)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &domain.APIError{
				Code:    http.StatusBadRequest,
				Message: "message for the address is not found",
			}
		}
		log.Printf("failed to get auth message: %v", err)
		return nil, domain.InternalError
	}

	if time.Since(msg.CreatedAt) >= s.cfg.AuthMessageTTL {
		return nil, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "message expired",
		}
	}

	hash := crypto.Keccak256([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(msg.Message), msg.Message)))
	sig := common.FromHex(signature)
	if sig[len(sig)-1] > 4 {
		sig[len(sig)-1] -= 27
	}
	pubKey, err := crypto.Ecrecover(hash, sig)
	if err != nil {
		return nil, &domain.APIError{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}
	pkey, err := crypto.UnmarshalPubkey(pubKey)
	if err != nil {
		return nil, &domain.APIError{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}
	signedAddress := crypto.PubkeyToAddress(*pkey)
	if strings.ToLower(signedAddress.Hex()) != strings.ToLower(address.String()) {
		return nil, &domain.APIError{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}

	number, err := s.repository.GetJwtTokenNumber(ctx, tx, signedAddress, jwt.PurposeAccess)
	if err != nil {
		log.Printf("failed to get token number: %v", err)
		return nil, domain.InternalError
	}

	accessToken, refreshToken, err := s.generateTokens(ctx, tx, signedAddress, number)
	if err != nil {
		log.Printf("failed to generate jwt tokens: %v", err)
		return nil, domain.InternalError
	}

	if number < 1 {
		exist, err := s.repository.UserExists(ctx, tx, signedAddress)
		if err != nil {
			log.Printf("failed to check user's existence: %v", err)
		} else if !exist {
			user := domain.User{Address: signedAddress, Role: domain.UserRoleUser}
			err := s.repository.InsertUser(ctx, tx, &user)
			if err != nil && !strings.Contains(err.Error(), "users_pkey") {
				log.Printf("failed to insert user: %v", err)
			}
			err = s.repository.InsertUserProfile(ctx, tx, domain.GetDefaultUserProfile(signedAddress))
			if err != nil && !errors.Is(err, repository.ErrProfileNotUniqueProfile) {
				log.Printf("failed to insert profile: %v", err)
			}
		}
	}

	profile, err := s.repository.GetUserProfile(ctx, tx, signedAddress)
	if err != nil {
		log.Printf("failed to get profile: %v", err)
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Profile:      profile,
	}, nil
}

func (s *service) RefreshJwtTokens(ctx context.Context, address common.Address, number int64) (*domain.AuthResponse, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropJwtTokens(ctx, tx, address, int(number)); err != nil {
		log.Printf("failed to drop jwt tokens: %v", err)
		return nil, domain.InternalError
	}

	accessToken, refreshToken, err := s.generateTokens(ctx, tx, address, int(number))
	if err != nil {
		log.Printf("failed to generate jwt tokens: %v", err)
		return nil, domain.InternalError
	}

	profile, err := s.repository.GetUserProfile(ctx, tx, address)
	if err != nil {
		log.Printf("failed to get profile: %v", err)
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	return &domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Profile:      profile,
	}, nil
}

func (s *service) generateTokens(ctx context.Context, tx pgx.Tx, address common.Address, number int) (*domain.JwtTokenInfo, *domain.JwtTokenInfo, error) {
	accessExpiresAt := now.Now().Add(s.cfg.AccessTokenTTL)
	accessTokenData := &jwt.TokenData{
		Purpose:   jwt.PurposeAccess,
		Address:   strings.ToLower(address.String()),
		Number:    number,
		ExpiresAt: accessExpiresAt,
		Secret:    generateSecret(0, address, number, jwt.PurposeAccess),
	}
	accessToken, err := s.jwtManager.GenerateJwtToken(accessTokenData)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate jwt access token: %w", err)
	}

	refreshExpiresAt := now.Now().Add(s.cfg.RefreshTokenTTL)
	refreshTokenData := &jwt.TokenData{
		Purpose:   jwt.PurposeRefresh,
		Address:   strings.ToLower(address.String()),
		Number:    number,
		ExpiresAt: refreshExpiresAt,
		Secret:    generateSecret(0, address, number, jwt.PurposeRefresh),
	}
	refreshToken, err := s.jwtManager.GenerateJwtToken(refreshTokenData)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	if err := s.repository.InsertJwtToken(ctx, tx, *accessTokenData); err != nil {
		return nil, nil, fmt.Errorf("generateTokensWithNumber/InsertJwtTokenAccess: %w", err)
	}
	if err := s.repository.InsertJwtToken(ctx, tx, *refreshTokenData); err != nil {
		return nil, nil, fmt.Errorf("generateTokensWithNumber/InsertJwtTokenRefresh: %w", err)
	}
	accessMilli := accessExpiresAt.UnixMilli()
	refreshMilli := refreshExpiresAt.UnixMilli()
	return &domain.JwtTokenInfo{
			Token:     &accessToken,
			ExpiresAt: &accessMilli,
		}, &domain.JwtTokenInfo{
			Token:     &refreshToken,
			ExpiresAt: &refreshMilli,
		}, nil
}

func (s *service) GetUserByJwtToken(ctx context.Context, purpose jwt.Purpose, token string) (*domain.Principal, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	tokenData, err := s.jwtManager.ParseJwtToken(token)
	if err != nil {
		log.Printf("failed to parse jwt token: %v", err)
		return nil, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to parse token",
		}
	}

	address := common.HexToAddress(tokenData.Address)
	secret, err := s.repository.GetJwtTokenSecret(ctx, tx, address, tokenData.Number, purpose)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &domain.APIError{
				Code:    http.StatusUnauthorized,
				Message: "failed to parse token",
			}
		}
		log.Printf("failed to get jwt token secret: %v", err)
		return nil, domain.InternalError
	}

	if tokenData.Secret != secret {
		return nil, &domain.APIError{
			Code:    http.StatusUnauthorized,
			Message: "wrong token secret",
		}
	}

	if time.Now().After(tokenData.ExpiresAt) {
		return nil, &domain.APIError{
			Code:    http.StatusUnauthorized,
			Message: "token is expired",
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	return &domain.Principal{
		Address: address,
		Number:  tokenData.Number,
	}, nil
}

func (s *service) Logout(ctx context.Context, address common.Address, number int64) *domain.APIError {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropJwtTokens(ctx, tx, address, int(number)); err != nil {
		log.Printf("failed to drop jwt tokens: %v", err)
		return domain.InternalError
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.InternalError
	}

	return nil
}

func (s *service) FullLogout(ctx context.Context, address common.Address) *domain.APIError {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed", err)
		return domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropAllJwtTokens(ctx, tx, address); err != nil {
		log.Printf("failed to drop all tokens: %v", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.InternalError
	}

	return nil
}

func generateSecret(role int, address common.Address, number int, purpose jwt.Purpose) string {
	toHashElems := []string{
		strconv.Itoa(role),
		strings.ToLower(address.String()),
		strconv.Itoa(number),
		strconv.Itoa(int(purpose)),
		utils.RandomString(20),
	}

	toHash := strings.Join(toHashElems, "_")
	hash := sha256.Sum256([]byte(toHash))

	return hex.EncodeToString(hash[:])
}

func generateAuthMessage(address common.Address) string {
	return fmt.Sprintf(authMessage, strings.ToLower(address.String()), utils.RandomString(64))
}
