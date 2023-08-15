package gapi

import (
	"fmt"
	"github.com/mark3d-xyz/mark3d/authserver/internal/config"
	"github.com/mark3d-xyz/mark3d/authserver/internal/service"
	authserver_pb "github.com/mark3d-xyz/mark3d/authserver/proto"
	"google.golang.org/grpc"
	"net"
)

type GRPCServer struct {
	cfg     *config.HandlerConfig
	options []grpc.ServerOption
	service service.Service

	authserver_pb.UnimplementedAuthServer
}

func NewGRPCServer(
	cfg *config.HandlerConfig,
	service service.Service,
	options []grpc.ServerOption,
) *GRPCServer {
	return &GRPCServer{
		cfg:     cfg,
		service: service,
		options: options,
	}
}

func (s *GRPCServer) ListenAndServe(port int) error {
	listener, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
	if err != nil {
		return fmt.Errorf("failed to listen: %w", err)
	}
	server := grpc.NewServer(s.options...)
	authserver_pb.RegisterAuthServer(server, s)
	if err := server.Serve(listener); err != nil {
		return err
	}

	return nil
}
