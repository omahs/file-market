package jwt

import "time"

type Purpose int

const (
	PurposeAccess = Purpose(iota)
	PurposeRefresh
)

type TokenData struct {
	Purpose   Purpose
	Role      int
	Address   string
	Number    int
	ExpiresAt time.Time
	Secret    string
}

type tokenManager struct {
	signingKey string
}

type TokenManager interface {
	GenerateJwtToken(data *TokenData) (string, error)
	ParseJwtToken(token string) (*TokenData, error)
}

func NewTokenManager(signingKey string) TokenManager {
	return &tokenManager{
		signingKey: signingKey,
	}
}
