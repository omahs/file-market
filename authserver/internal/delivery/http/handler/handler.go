package handler

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/authserver/internal/config"
	"github.com/mark3d-xyz/mark3d/authserver/internal/service"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	"log"
	"net/http"
)

type Handler interface {
	Init() http.Handler
}

type handler struct {
	cfg     *config.HandlerConfig
	service service.Service
}

func New(cfg *config.HandlerConfig, service service.Service) Handler {
	return &handler{
		cfg:     cfg,
		service: service,
	}
}

func (h *handler) Init() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/auth/message", h.handleGetAuthMessage)
	router.HandleFunc("/auth/by_signature", h.handleAuthBySignature)
	router.Handle("/auth/refresh", h.headerAuthMiddleware(jwt.PurposeRefresh)(http.HandlerFunc(h.handleRefresh)))
	router.Handle("/auth/logout", h.headerAuthMiddleware(jwt.PurposeRefresh)(http.HandlerFunc(h.handleLogout)))
	router.Handle("/auth/full_logout", h.headerAuthMiddleware(jwt.PurposeAccess)(http.HandlerFunc(h.handleFullLogout)))
	router.Handle("/auth/check_auth", h.headerAuthMiddleware(jwt.PurposeAccess)(http.HandlerFunc(h.handleGetUserProfile)))

	router.Handle("/profile/update", h.headerAuthMiddleware(jwt.PurposeAccess)(http.HandlerFunc(h.handleUpdateUserProfile)))
	router.Handle("/profile/set_email", h.headerAuthMiddleware(jwt.PurposeAccess)(http.HandlerFunc(h.handleSetEmail)))
	router.HandleFunc("/profile/verify_email", h.handleVerifyEmail)
	router.HandleFunc("/profile/{identification}", h.handleGetUserProfile)

	return router
}

func sendResponse(w http.ResponseWriter, code int64, res any) {
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
	sendResponse(w, 200, map[string]bool{"success": true})
}
