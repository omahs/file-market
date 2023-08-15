package handler

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/authserver/internal/domain"
	"log"
	"net/http"
)

func (h *handler) handleGetUserProfile(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		// Not Authenticated
		identification := mux.Vars(r)["identification"]
		profile, err := h.service.GetProfileByIdentification(ctx, identification)
		if err != nil {
			sendResponse(w, err.Code, err)
			return
		}
		sendResponse(w, 200, profile)
		return
	} else {
		// Authenticated
		profile, err := h.service.GetUserProfileByAddress(ctx, user.Address, true)
		if err != nil {
			sendResponse(w, err.Code, err)
			return
		}

		sendResponse(w, 200, profile)
		return
	}
}

func (h *handler) handleUpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		log.Printf("user address is missing in context")
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}
	var req domain.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse profile: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.ValidateForUpdate(); err != nil {
		log.Printf("failed to validate auth message request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to validate auth message request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	req.Address = user.Address
	profile, err := h.service.UpdateUserProfile(ctx, &req)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	sendResponse(w, 200, profile)
}

func (h *handler) handleSetEmail(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	user, ok := r.Context().Value(CtxKeyUser).(*domain.Principal)
	if !ok {
		log.Printf("user address is missing in context")
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var req domain.SetEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(); err != nil {
		log.Printf("failed to validate email verification request: %v", err)
		sendResponse(w, http.StatusBadRequest, &domain.APIError{
			Code:    http.StatusBadRequest,
			Message: "failed to validate email verification request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if err := h.service.SetEmail(ctx, user.Address, req.Email); err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleVerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("secret_token")

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if err := h.service.VerifyEmail(ctx, token); err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	sendSuccessResponse(w)
}
