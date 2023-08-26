package handler

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/go-openapi/strfmt"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"net/http"
)

func (h *handler) handleGetCollection(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	collection, e := h.service.GetCollection(ctx, common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, collection)
}

func (h *handler) handleGetCollections(w http.ResponseWriter, r *http.Request) {
	lastCollectionAddress := parseCommonAddressParam(r, "lastCollectionAddress")
	limit, err := parseLimitParam(r, "limit", 10, 100)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetCollections(ctx, lastCollectionAddress, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleGetFullCollection(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 10, 100)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetCollectionWithTokens(ctx, common.HexToAddress(address), lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleGetFullPublicCollection(w http.ResponseWriter, r *http.Request) {
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 0, 100)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	res, e := h.service.GetPublicCollectionWithTokens(ctx, lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleGetFullFileBunniesCollection(w http.ResponseWriter, r *http.Request) {
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 0, 100)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	res, e := h.service.GetFileBunniesCollectionWithTokens(ctx, lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleUpdateCollectionProfile(w http.ResponseWriter, r *http.Request) {
	if r.Body != nil {
		defer r.Body.Close()
	}

	user, ok := r.Context().Value(CtxKeyUser).(*domain.User)
	if !ok {
		logger.Error("user is missing in context", errors.New("user is missing"), nil)
		sendResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var req models.UpdateCollectionProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("failed to parse update collection profile request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to parse body",
		})
		return
	}

	if err := req.Validate(strfmt.Default); err != nil {
		logger.Error("failed to validate update collection profile request", err, nil)
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "failed to validate update collection profile request",
			Detail:  err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.UpdateCollectionProfile(ctx, user.Address, &req)
	if e != nil {
		sendResponse(w, e.Code, e.Message)
		return
	}

	sendResponse(w, 200, res)
}
