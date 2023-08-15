package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"github.com/mark3d-xyz/mark3d/authserver/internal/repository"
	"github.com/mark3d-xyz/mark3d/authserver/internal/utils"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/validator"
	"log"
	"net/http"
	"strings"
	"time"
)

func (s *service) GetUserProfileByUsername(
	ctx context.Context,
	username string,
) (*domain.UserProfile, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	profile, err := s.repository.GetUserProfileByUsername(ctx, tx, username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &domain.APIError{
				Code:    http.StatusNotFound,
				Message: "user was not found",
			}
		}
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	profile.HidePrivateFields()

	return profile, nil
}

func (s *service) GetUserProfileByAddress(
	ctx context.Context,
	address common.Address,
	isPrincipal bool,
) (*domain.UserProfile, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	profile, err := s.repository.GetUserProfile(ctx, tx, address)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, &domain.APIError{
				Code:    http.StatusNotFound,
				Message: "user was not found",
			}
		}
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	if !isPrincipal {
		profile.HidePrivateFields()
	}

	return profile, nil
}

func (s *service) GetProfileByIdentification(ctx context.Context, identification string) (*domain.UserProfile, *domain.APIError) {
	if identification == "" {
		return nil, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "user's address or username is missing",
		}
	}

	identificationType := ""
	if validator.ValidateAddress(&identification) == nil {
		identificationType = "address"
	} else if validator.ValidateUsername(&identification) == nil {
		identificationType = "username"
	}

	switch identificationType {
	case "address":
		profile, err := s.GetUserProfileByAddress(ctx, common.HexToAddress(identification), false)
		if err != nil {
			return nil, err
		}
		return profile, nil
	case "username":
		profile, err := s.GetUserProfileByUsername(ctx, strings.ToLower(identification))
		if err != nil {
			return nil, err
		}

		return profile, nil
	default:
		return nil, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "user's address or username is wrong",
		}
	}
}

func (s *service) UpdateUserProfile(
	ctx context.Context,
	profile *domain.UserProfile,
) (*domain.UserProfile, *domain.APIError) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	oldProfile, err := s.repository.GetUserProfile(ctx, tx, profile.Address)
	if err != nil {
		log.Printf("failed to update profile: %v", err)
		return nil, domain.InternalError
	}

	updateUserProfileFields(profile, oldProfile)

	if err := s.repository.UpdateUserProfile(ctx, tx, profile); err != nil {
		if errors.Is(err, pgx.ErrNoRows) ||
			errors.Is(err, repository.ErrProfileNotUniqueUsername) ||
			errors.Is(err, repository.ErrProfileNotUniqueEmail) {
			return nil, &domain.APIError{
				Code:    http.StatusBadRequest,
				Message: err.Error(),
			}
		}

		log.Printf("failed to update user profile: %v", err)
		return nil, domain.InternalError
	}

	res, err := s.repository.GetUserProfile(ctx, tx, profile.Address)
	if err != nil {
		log.Printf("failed to get profile: %v", err)
		return nil, domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, domain.InternalError
	}

	return res, nil
}

func (s *service) SetEmail(
	ctx context.Context,
	address common.Address,
	email string,
) *domain.APIError {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	verificationToken := utils.RandomString(32)
	if err := s.repository.InsertEmailVerificationToken(ctx, tx, &domain.EmailVerificationToken{
		Address:   address,
		Email:     email,
		Token:     verificationToken,
		CreatedAt: time.Now(),
	}); err != nil {
		log.Printf("failed to insert email verification token: %v", err)
		return domain.InternalError
	}

	if err := s.SendEmailVerificationEmail(verificationToken, email); err != nil {
		log.Printf("failed to send email: %v", err)
		return domain.InternalError
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.InternalError
	}

	return nil
}

func (s *service) VerifyEmail(
	ctx context.Context,
	secretToken string,
) *domain.APIError {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return domain.InternalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)

	token, err := s.repository.GetEmailVerificationToken(ctx, tx, secretToken)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return &domain.APIError{
				Code:    http.StatusNotFound,
				Message: "Token not found",
			}
		}
		log.Printf("failed to get verification token: %v", err)
		return domain.InternalError
	}

	if time.Since(token.CreatedAt) > s.cfg.EmailVerificationTokenTTL {
		return &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "Token is expired",
		}
	}

	if err := s.repository.UpdateUserProfileEmail(ctx, tx, token.Email, token.Address); err != nil {
		log.Printf("failed to update profile email: %v", err)
		return domain.InternalError
	}

	if err := s.repository.DeleteAllEmailVerificationTokens(ctx, tx, token.Address); err != nil {
		log.Printf("failed to delete all verification tokens: %v", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.InternalError
	}

	return nil
}

func (s *service) SendEmailVerificationEmail(token string, email string) error {
	subject := "Filemarket Email Verification" // TODO: move to cfg
	host := s.cfg.Host
	if host[len(host)-1] == '/' {
		host = host[:len(host)-1]
	}
	link := fmt.Sprintf("%s/profile/verify_email?secret_token=%s", host, token)
	// TODO: use HTML template file
	contentTemplate := `
		<h1>Filemarket Email Verification</h1>
		Click to verify email on Filemarket.xyz<br/>
		%s
	`
	content := fmt.Sprintf(contentTemplate, link)
	return s.emailSender.SendEmail(subject, content, []string{email}, nil, nil, nil)
}

// updateUserProfileFields updates `new` profile fields except email and twitter
func updateUserProfileFields(new *domain.UserProfile, old *domain.UserProfile) {
	if new.Name == "" {
		new.Name = old.Name
	}
	if new.Username == "" {
		new.Username = old.Username
	}
	if new.Bio == "" {
		new.Bio = old.Bio
	}
	if new.WebsiteURL == "" {
		new.WebsiteURL = old.WebsiteURL
	}
	if new.AvatarURL == "" {
		new.AvatarURL = old.AvatarURL
	}
	if new.BannerURL == "" {
		new.BannerURL = old.BannerURL
	}

}
