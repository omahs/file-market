package jwt

import (
	"fmt"
	jwt2 "github.com/dgrijalva/jwt-go"
	"time"
)

func parseTokenIntClaim(claims jwt2.MapClaims, key string) (int64, error) {
	if parsedValue, ok := claims[key].(float64); !ok {
		return 0, fmt.Errorf("parseTokenIntClaim: error: invalid token claim: %s", key)
	} else {
		return int64(parsedValue), nil
	}
}

func parseTokenStringClaim(claims jwt2.MapClaims, key string) (string, error) {
	if stringValue, ok := claims[key].(string); !ok {
		return "", fmt.Errorf("parseTokenStringClaim: error: invalid token claim: %s", key)
	} else {
		return stringValue, nil
	}
}

func (t *tokenManager) ParseJwtToken(token string) (*TokenData, error) {
	parsedToken, err := jwt2.Parse(token, func(token *jwt2.Token) (i interface{}, e error) {
		if _, ok := token.Method.(*jwt2.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("ParseJwtToken/Parse: error: unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(t.signingKey), nil
	})
	if err != nil && parsedToken == nil {
		return nil, fmt.Errorf("ParseJwtToken/Parse: parse token failed: %w", err)
	}
	claims, ok := parsedToken.Claims.(jwt2.MapClaims)
	if !ok {
		return nil, fmt.Errorf("ParseJwtToken/parsedToken.Claims: error: token wrong claims")
	}
	purpose, err := parseTokenIntClaim(claims, "purpose")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/purpose: %w", err)
	}
	if purpose != int64(PurposeAccess) && purpose != int64(PurposeRefresh) {
		return nil, fmt.Errorf("ParseJwtToken: error: invalid purpose: %d", purpose)
	}
	address, err := parseTokenStringClaim(claims, "address")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/id: %w", err)
	}
	number, err := parseTokenIntClaim(claims, "number")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/number: %w", err)
	}
	role, err := parseTokenIntClaim(claims, "role")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/role: %w", err)
	}
	secret, err := parseTokenStringClaim(claims, "secret")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/secret: %w", err)
	}
	expiresAt, err := parseTokenIntClaim(claims, "exp")
	if err != nil {
		return nil, fmt.Errorf("ParseJwtToken/parseTokenIntClaim/exp: %w", err)
	}
	return &TokenData{
		Purpose:   Purpose(purpose),
		Role:      int(role),
		Address:   address,
		Number:    int(number),
		ExpiresAt: time.Unix(expiresAt, 0),
		Secret:    secret,
	}, nil
}
