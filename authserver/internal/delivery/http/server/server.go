package server

import (
	"context"
	"fmt"
	"github.com/mark3d-xyz/mark3d/authserver/internal/config"
	"net/http"
)

type Server struct {
	httpServer *http.Server
}

func New(cfg *config.ServerConfig, handler http.Handler) *Server {
	return &Server{
		httpServer: &http.Server{
			Addr:           fmt.Sprintf("0.0.0.0:%d", cfg.HttpPort),
			Handler:        handler,
			ReadTimeout:    cfg.ReadTimeout,
			WriteTimeout:   cfg.WriteTimeout,
			MaxHeaderBytes: cfg.MaxHeaderBytes,
		},
	}
}

func (s *Server) ListenAndServe() error {
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
