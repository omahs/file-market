package jwt

import (
	"fmt"
	jwt2 "github.com/dgrijalva/jwt-go"
)

func (t *tokenManager) GenerateJwtToken(data *TokenData) (string, error) {
	claims := jwt2.MapClaims{
		"address": data.Address,
		"role":    data.Role,
		"purpose": int64(data.Purpose),
		"secret":  data.Secret,
		"exp":     data.ExpiresAt.Unix(),
		"number":  data.Number,
	}
	token := jwt2.NewWithClaims(jwt2.SigningMethodHS256, claims)
	res, err := token.SignedString([]byte(t.signingKey))
	if err != nil {
		return "", fmt.Errorf("GenerateJwtToken/SignedString: sign token failed: %w", err)
	}
	return res, nil
}
