package clients

import (
	"context"
	authserver_pb "github.com/mark3d-xyz/mark3d/indexer/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/backoff"
	"google.golang.org/grpc/credentials/insecure"
)

type AuthClient struct {
	authserver_pb.AuthClient
	conn *grpc.ClientConn
}

func NewAuthClient(ctx context.Context, endpoint string) (*AuthClient, error) {
	conn, err := grpc.DialContext(
		ctx,
		endpoint,
		grpc.WithBlock(),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithConnectParams(grpc.ConnectParams{
			Backoff: backoff.DefaultConfig,
		}),
	)
	if err != nil {
		return nil, err
	}

	client := &AuthClient{
		AuthClient: authserver_pb.NewAuthClient(conn),
		conn:       conn,
	}
	return client, nil
}

func (c *AuthClient) Close() error {
	return c.conn.Close()
}
