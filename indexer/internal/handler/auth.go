package handler

import (
	"context"
	"encoding/json"
	"github.com/go-openapi/strfmt"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/jwt"
	"google.golang.org/grpc/metadata"
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
	var req models.AuthMessageRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse auth message request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

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
	defer r.Body.Close()
	var req models.AuthBySignatureRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse authBySignature request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

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
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.RefreshJwtTokens(ctx)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleLogout(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if _, e := h.service.Logout(ctx); e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleFullLogout(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if _, e := h.service.FullLogout(ctx); e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendSuccessResponse(w)
}

func (h *handler) handleCheckAuth(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.CheckAuth(ctx)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
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
				sendResponse(w, e.Code, e)
				return
			}

			ctx := context.WithValue(r.Context(), CtxKeyUser, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// headerAuthCtxMiddleware used for setting `authorization` value in ctx for grpc
func (h *handler) headerAuthCtxMiddleware() func(http.Handler) http.Handler {
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

			ctx := metadata.AppendToOutgoingContext(r.Context(), "authorization", a)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
