package handler

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service/subscription"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/log"
	"math/big"
	"net/http"
	"strings"
)

func (h *handler) subscribeToBlockNumber(w http.ResponseWriter, r *http.Request) {
	ws, err := h.subscriptionService.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		sendResponse(w, http.StatusInternalServerError, map[string]any{"message": err.Error()})
		return
	}
	h.subscriptionService.AddSubscription(&subscription.Sub{
		Client: ws,
		Topic:  subscription.LastBlockNumberTopic,
	})
}

func (h *handler) subscribeToEFT(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	id, ok := big.NewInt(0).SetString(mux.Vars(r)["id"], 10)
	if !ok {
		sendResponse(w, http.StatusBadRequest, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "parse id failed",
		})
		return
	}

	ws, err := h.subscriptionService.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error("failed to connect to EFT subscription", err, log.Fields{"address": address, "tokenId": id.String()})
		sendResponse(w, http.StatusInternalServerError, map[string]any{"message": err.Error()})
		return
	}
	topic := fmt.Sprintf(subscription.EFTSubTopicFormat, strings.ToLower(address), id.String())
	h.subscriptionService.AddSubscription(&subscription.Sub{
		Client: ws,
		Topic:  topic,
	})
}
