package subscription

import (
	"context"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
	"time"
)

const (
	LastBlockNumberTopic = "last_block_number"

	EFTSubTopicFormat = "%s:%s" // "<address>:<tokenId>"
)

type Sub struct {
	Client *websocket.Conn
	Topic  string
}

type Service struct {
	Upgrader websocket.Upgrader

	subs   map[*Sub]struct{}
	subsMu sync.RWMutex
}

func NewService() *Service {
	return &Service{
		Upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		subs: make(map[*Sub]struct{}),
	}
}

func (s *Service) AddSubscription(sub *Sub) {
	s.subsMu.Lock()
	defer s.subsMu.Unlock()

	s.subs[sub] = struct{}{}
}

func (s *Service) RemoveSubscription(sub *Sub) {
	s.subsMu.Lock()
	defer s.subsMu.Unlock()

	delete(s.subs, sub)
	if sub.Client != nil {
		sub.Client.Close()
	}
	log.Printf("ws conn for topic `%s` was removed", sub.Topic)
}

func (s *Service) BroadcastMessage(topic string, data []byte) {
	var subsToRemove []*Sub

	s.subsMu.RLock()
	{
		for sub := range s.subs {
			if sub.Topic != topic {
				continue
			}
			if err := s.sendMessage(sub, data); err != nil {
				subsToRemove = append(subsToRemove, sub)
			}
		}
	}
	s.subsMu.RUnlock()

	for _, subscription := range subsToRemove {
		s.RemoveSubscription(subscription)
	}
}

// PingConnections is blocking. Should be used in goroutine
func (s *Service) PingConnections(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			var subsToRemove []*Sub

			s.subsMu.Lock()
			for sub, _ := range s.subs {
				if err := sub.Client.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
					subsToRemove = append(subsToRemove, sub)
				}
			}
			s.subsMu.Unlock()

			for _, subscription := range subsToRemove {
				s.RemoveSubscription(subscription)
			}
		case <-ctx.Done():
			return
		}
	}
}

func (s *Service) sendMessage(sub *Sub, data []byte) error {
	err := sub.Client.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		sub.Client.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	}
	return err
}
