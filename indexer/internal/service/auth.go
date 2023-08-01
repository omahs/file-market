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
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/jwt"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/now"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	alphabet    = "abcdefghijklmnopqrstuvwxyz1234567890"
	authMessage = "Hello, %s! Please, sign this message with random param %s to sign in into FileMarket"
)

func (s *service) AuthBySignature(ctx context.Context, req models.AuthBySignatureRequest) (*models.AuthResponse, *models.ErrorResponse) {
	address := common.HexToAddress(*req.Address)

	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	msg, err := s.repository.GetAuthMessage(ctx, tx, address)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &models.ErrorResponse{
				Code:    http.StatusBadRequest,
				Message: "message for the address is not found",
			}
		}
		logger.Error("failed to get auth message", err, nil)
		return nil, internalError
	}

	if time.Since(msg.CreatedAt) >= s.cfg.AuthMessageTTL {
		return nil, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "message expired",
		}
	}

	hash := crypto.Keccak256([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(msg.Message), msg.Message)))
	sig := common.FromHex(*req.Signature)
	if sig[len(sig)-1] > 4 {
		sig[len(sig)-1] -= 27
	}
	pubKey, err := crypto.Ecrecover(hash, sig)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}
	pkey, err := crypto.UnmarshalPubkey(pubKey)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}
	signedAddress := crypto.PubkeyToAddress(*pkey)
	if strings.ToLower(signedAddress.Hex()) != strings.ToLower(address.String()) {
		return nil, &models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: "wrong signature",
		}
	}

	accessToken, refreshToken, err := s.generateTokens(ctx, tx, signedAddress)
	if err != nil {
		logger.Error("failed to generate jwt tokens", err, nil)
		return nil, internalError
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) GetAuthMessage(ctx context.Context, req models.AuthMessageRequest) (*models.AuthMessageResponse, *models.ErrorResponse) {
	address := common.HexToAddress(*req.Address)

	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	msg, err := s.repository.GetAuthMessage(ctx, tx, address)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		log.Printf("failed to get auth message: %v\n", err)
		return nil, internalError
	}
	if msg != nil {
		if time.Since(msg.CreatedAt) < s.cfg.AuthMessageTTL {
			return &models.AuthMessageResponse{Message: &msg.Message}, nil
		}
	}

	// msg not found or expired
	if err := s.repository.DeleteAuthMessage(ctx, tx, address); err != nil {
		logger.Error("failed to delete auth message", err, nil)
		return nil, internalError
	}

	newMsg := generateAuthMessage(address)
	if err := s.repository.InsertAuthMessage(ctx, tx, domain.AuthMessage{
		Address:   address,
		Message:   newMsg,
		CreatedAt: time.Now(),
	}); err != nil {
		logger.Error("failed to insert new auth message", err, nil)
		return nil, internalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, internalError
	}

	return &models.AuthMessageResponse{Message: &newMsg}, nil
}

func (s *service) RefreshJwtTokens(ctx context.Context, address common.Address, number int64) (*models.AuthResponse, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropJwtTokens(ctx, tx, address, int(number)); err != nil {
		logger.Error("failed to drop jwt tokens", err, nil)
		return nil, internalError
	}

	accessToken, refreshToken, err := s.generateTokensWithNumber(ctx, tx, address, int(number))
	if err != nil {
		logger.Error("failed to generate jwt tokens", err, nil)
		return nil, internalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, internalError
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) generateTokens(ctx context.Context, tx pgx.Tx, address common.Address) (*models.JwtTokenInfo, *models.JwtTokenInfo, error) {
	number, err := s.repository.GetJwtTokenNumber(ctx, tx, address, jwt.PurposeAccess)
	if err != nil {
		return nil, nil, fmt.Errorf("generateTokens/GetJwtTokenNumber: %w", err)
	}

	return s.generateTokensWithNumber(ctx, tx, address, number)
}

func (s *service) generateTokensWithNumber(ctx context.Context, transaction pgx.Tx, address common.Address, number int) (*models.JwtTokenInfo, *models.JwtTokenInfo, error) {
	accessExpiresAt := now.Now().Add(s.cfg.AccessTokenTTL * time.Millisecond)
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

	if err = s.repository.InsertJwtToken(ctx, transaction, *accessTokenData); err != nil {
		return nil, nil, fmt.Errorf("generateTokensWithNumber/InsertJwtTokenAccess: %w", err)
	}
	if err = s.repository.InsertJwtToken(ctx, transaction, *refreshTokenData); err != nil {
		return nil, nil, fmt.Errorf("generateTokensWithNumber/InsertJwtTokenRefresh: %w", err)
	}
	accessMilli := accessExpiresAt.UnixMilli()
	refreshMilli := refreshExpiresAt.UnixMilli()
	return &models.JwtTokenInfo{
			Token:     &accessToken,
			ExpiresAt: &accessMilli,
		}, &models.JwtTokenInfo{
			Token:     &refreshToken,
			ExpiresAt: &refreshMilli,
		}, nil
}

func (s *service) GetUserByJwtToken(ctx context.Context, purpose jwt.Purpose, token string) (*domain.User, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	tokenData, err := s.jwtManager.ParseJwtToken(token)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse token",
		}
	}

	address := common.HexToAddress(tokenData.Address)
	secret, err := s.repository.GetJwtTokenSecret(ctx, tx, address, tokenData.Number, purpose)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &models.ErrorResponse{
				Code:    http.StatusUnauthorized,
				Message: "failed to parse token",
			}
		}
		logger.Error("failed to get jwt token secret", err, nil)
		return nil, internalError
	}

	if tokenData.Secret != secret {
		return nil, &models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: "wrong token secret",
		}
	}

	return &domain.User{
		Address: address,
		Number:  tokenData.Number,
	}, nil
}

func (s *service) Logout(ctx context.Context, address common.Address, number int64) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropJwtTokens(ctx, tx, address, int(number)); err != nil {
		logger.Error("failed to drop jwt tokens", err, nil)
		return internalError
	}
	if err := tx.Commit(ctx); err != nil {
		return internalError
	}

	return nil
}

func (s *service) FullLogout(ctx context.Context, address common.Address) *models.ErrorResponse {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	if err := s.repository.DropAllJwtTokens(ctx, tx, address); err != nil {
		logger.Error("failed to drop all tokens", err, nil)
	}

	if err := tx.Commit(ctx); err != nil {
		return internalError
	}

	return nil
}

func generateSecret(role int, address common.Address, number int, purpose jwt.Purpose) string {
	toHashElems := []string{
		strconv.Itoa(role),
		strings.ToLower(address.String()),
		strconv.Itoa(number),
		strconv.Itoa(int(purpose)),
		randomString(20),
	}

	toHash := strings.Join(toHashElems, "_")
	hash := sha256.Sum256([]byte(toHash))

	return hex.EncodeToString(hash[:])
}

func generateAuthMessage(address common.Address) string {
	return fmt.Sprintf(authMessage, strings.ToLower(address.String()), randomString(64))
}

func randomString(l int) string {
	res := make([]byte, l)
	for i := 0; i < l; i++ {
		res[i] = alphabet[rand.Intn(len(alphabet))]
	}

	return string(res)
}
