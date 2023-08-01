package handler

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/go-openapi/strfmt"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"net/http"
)

func (h *handler) handleReportCollection(w http.ResponseWriter, r *http.Request) {
	if r.Body != nil {
		defer r.Body.Close()
	}

	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user is missing in context", errors.New("user is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var req models.ReportCollectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse report collection request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(strfmt.Default); err != nil {
		logger.Error("failed to validate report collection request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate report collection request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.ReportCollection(ctx, user.Address, &req); e != nil {
		sendResponse(w, e.Code, e.Message)
		return
	}

	sendSuccessResponse(w)
}

func (h *handler) handleReportToken(w http.ResponseWriter, r *http.Request) {
	if r.Body != nil {
		defer r.Body.Close()
	}

	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user is missing in context", errors.New("user is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var req models.ReportTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse report token request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(strfmt.Default); err != nil {
		logger.Error("failed to validate report token request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate report token request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	if e := h.service.ReportToken(ctx, user.Address, &req); e != nil {
		sendResponse(w, e.Code, e.Message)
		return
	}

	sendSuccessResponse(w)
}
