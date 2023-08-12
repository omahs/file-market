package handler

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/go-openapi/strfmt"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/jwt"
	"net/http"
	"strings"
)

type CtxKey string

const (
	CtxKeyUser = CtxKey("user")
	TokenStart = "Bearer "
)

func (h *handler) handleGetAuthMessage(w http.ResponseWriter, r *http.Request) {
	var req models.AuthMessageRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse auth message request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}
	defer r.Body.Close()

	if err := req.Validate(strfmt.Default); err != nil {
		logger.Error("failed to validate auth message request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate auth message request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetAuthMessage(ctx, req)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleAuthBySignature(w http.ResponseWriter, r *http.Request) {
	var req models.AuthBySignatureRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse authBySignature request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}
	defer r.Body.Close()

	if err := req.Validate(strfmt.Default); err != nil {
		logger.Error("failed to validate authBySignature request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate authBySignature request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.AuthBySignature(ctx, req)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleRefresh(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user address is missing in context", errors.New("address is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.RefreshJwtTokens(ctx, user.Address, int64(user.Number))
	if e != nil {
		sendResponse(w, e.Code, e.Message)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleLogout(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user is missing in context", errors.New("user is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.Logout(ctx, user.Address, int64(user.Number)); e != nil {
		sendResponse(w, e.Code, e.Message)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleFullLogout(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user is missing in context", errors.New("user is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.FullLogout(ctx, user.Address); e != nil {
		sendResponse(w, e.Code, e.Message)
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
				sendResponse(w, 401, &models.ErrorResponse{
					Code:    http.StatusUnauthorized,
					Message: "wrong token",
				})
				return
			}

			user, e := h.service.GetUserByJwtToken(r.Context(), purpose, a[len(TokenStart):])
			if e != nil {
				sendResponse(w, e.Code, e.Message)
				return
			}

			ctx := context.WithValue(r.Context(), CtxKeyUser, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
