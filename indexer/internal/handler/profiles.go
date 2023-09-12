package handler

import (
	"context"
	"encoding/json"
	"github.com/go-openapi/strfmt"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"net/http"
)

func (h *handler) handleGetUserProfile(w http.ResponseWriter, r *http.Request) {
	identification := mux.Vars(r)["identification"]

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetUserProfile(ctx, identification, false)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleProfileEmailExists(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req models.ProfileEmailExistsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to decode request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.EmailExists(ctx, req.Email)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleProfileNameExists(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req models.ProfileNameExistsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to decode request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.NameExists(ctx, req.Name)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleProfileUsernameExists(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req models.ProfileUsernameExistsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to decode request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.UsernameExists(ctx, req.Username)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleUpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse profile: %v", err)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.UpdateUserProfile(ctx, &req)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendResponse(w, 200, res)
}

func (h *handler) handleSetEmail(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req models.SetEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("failed to parse request: %v", err)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(strfmt.Default); err != nil {
		log.Printf("failed to validate email verification request: %v", err)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate email verification request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.SetEmail(ctx, req.Email); e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleVerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("secret_token")

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	link, e := h.service.VerifyEmail(ctx, token)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}

	http.Redirect(w, r, link, http.StatusMovedPermanently)
}
