package handler

import (
	"encoding/json"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"net/http"
)

func sendResponse(w http.ResponseWriter, code int64, res interface{}) {
	data, err := json.Marshal(res)
	if err != nil {
		log.Println("marshal response failed: ", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(int(code))
	if _, err := w.Write(data); err != nil {
		log.Println("write response failed: ", err)
		return
	}
}

func sendSuccessResponse(w http.ResponseWriter) {
	s := true
	sendResponse(w, 200, &models.SuccessResponse{
		Success: &s,
	})
}
