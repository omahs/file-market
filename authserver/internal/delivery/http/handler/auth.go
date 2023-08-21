package handler

import (
	"context"
	"encoding/json"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	"log"
	"net/http"
	"strings"
)

type CtxKey string

const (
	CtxKeyUser = CtxKey("user")
	TokenStart = "Bearer "
)

func (h *handler) handleGetAuthMessage(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req domain.AuthMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse auth message request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(); err != nil {
		log.Printf("failed to validate auth message reques: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to validate auth message request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetAuthMessage(ctx, common.HexToAddress(*req.Address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleAuthBySignature(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req domain.AuthBySignatureRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse authBySignature request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(); err != nil {
		log.Printf("failed to validate authBySignature request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to validate authBySignature request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	address := common.HexToAddress(*req.Address)
	res, e := h.service.AuthBySignature(ctx, address, *req.Signature)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleRefresh(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		log.Printf("user address is missing in context")
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.RefreshJwtTokens(ctx, user.Address, int64(user.Number))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleLogout(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		log.Printf("user is missing in context")
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.Logout(ctx, user.Address, int64(user.Number)); e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleFullLogout(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		log.Printf("user is missing in context")
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.FullLogout(ctx, user.Address); e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendSuccessResponse(w)
}

func (h *handler) headerAuthMiddleware(purpose jwt.Purpose) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			a := r.Header.Get("Authorization")
			isToken := strings.HasPrefix(a, TokenStart)
			if !isToken {
				sendResponse(w, 401, &domain.APIError{
					Code:    http.StatusUnauthorized,
					Message: "wrong token",
				})
				return
			}

			user, e := h.service.GetUserByJwtToken(r.Context(), purpose, a[len(TokenStart):])
			if e != nil {
				sendResponse(w, e.Code, e)
				return
			}

			ctx := context.WithValue(r.Context(), CtxKeyUser, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func (h *handler) headerOptionalAuthMiddleware(purpose jwt.Purpose) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			a := r.Header.Get("Authorization")
			isToken := strings.HasPrefix(a, TokenStart)
			if !isToken {
				user, e := h.service.GetUserByJwtToken(r.Context(), purpose, a[len(TokenStart):])
				if e != nil {
					sendResponse(w, e.Code, e)
					return
				}
				ctx = context.WithValue(ctx, CtxKeyUser, user)
			}

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
