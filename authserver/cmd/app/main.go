package main

import (
	"context"
	"errors"
	"flag"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/mark3d-xyz/mark3d/authserver/internal/config"
	"github.com/mark3d-xyz/mark3d/authserver/internal/delivery/gapi"
	handler2 "github.com/mark3d-xyz/mark3d/authserver/internal/delivery/http/handler"
	server2 "github.com/mark3d-xyz/mark3d/authserver/internal/delivery/http/server"
	repository2 "github.com/mark3d-xyz/mark3d/authserver/internal/repository"
	service2 "github.com/mark3d-xyz/mark3d/authserver/internal/service"
	"github.com/mark3d-xyz/mark3d/authserver/pkg/jwt"
	"google.golang.org/grpc"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)
	var cfgPath string
	flag.StringVar(&cfgPath, "cfg", "configs/local", "config path")
	flag.Parse()

	cfg, err := config.Init(cfgPath)
	if err != nil {
		log.Fatalf("failed to init config: %v", err)
	}

	ctx := context.Background()
	pool, err := pgxpool.Connect(ctx, cfg.Postgres.PgSource())
	if err != nil {
		log.Fatalf("failed to open pg connection: %v", err)
	}
	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("failed to ping db: %v", err)
	}

	repository := repository2.New(pool)
	service := service2.New(
		cfg.Service,
		repository,
		jwt.NewTokenManager(cfg.TokenManager.SigningKey),
	)
	handler := handler2.New(cfg.Handler, service).Init()
	server := server2.New(cfg.Server, handler)

	go func() {
		err := server.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("http server error: %v", err)
		}
	}()

	grpcServer := gapi.NewGRPCServer(cfg.Handler, service, []grpc.ServerOption{})
	go func() {
		if err := grpcServer.ListenAndServe(cfg.Server.GRPCPort); err != nil {
			log.Fatalf("grpc server error: %v", err)
		}
	}()

	log.Printf("server listening on port %d(http) add %d(gRPC)..\n", cfg.Server.HttpPort, cfg.Server.GRPCPort)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	<-quit

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("failed to shutdown the server: %v", err)
	}
	pool.Close()

	log.Println("server shutdown successful")
}
