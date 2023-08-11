package ws

import (
	"context"
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/now"
	"math/rand"
	"net/http"
	"sync"
)

var (
	ErrFailedToConstructId = errors.New("failed to construct unique id")
)

type Pool interface {
	AddConnection(w http.ResponseWriter, r *http.Request, topic string, initMsg any) error
	SendTopicSub(topic string, data any)
	SendUserSub(id int64, data any)
	Shutdown()
	SetOnConnectResponse(fn func(context.Context, any) any)
	GetOnConnectResponse() func(context.Context, any) any
}

type wsPool struct {
	OnConnectResponse func(context.Context, any) any

	upgrader *websocket.Upgrader
	pool     sameRolePool
}

type sameRolePool struct {
	lock  *sync.RWMutex
	conns map[int64]map[string]*conn
}

func NewWsPool() Pool {
	u := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	res := &wsPool{
		pool: sameRolePool{
			conns: map[int64]map[string]*conn{},
			lock:  &sync.RWMutex{},
		},
		upgrader: u,
		OnConnectResponse: func(ctx context.Context, a any) any {
			logger.Error("OnConnectResponse was not set", nil, nil)
			return errors.New("internal error")
		},
	}
	return res
}

func (p *wsPool) SetOnConnectResponse(fn func(context.Context, any) any) {
	p.OnConnectResponse = fn
}

func (p *wsPool) GetOnConnectResponse() func(context.Context, any) any {
	return p.OnConnectResponse
}

func (p *wsPool) AddConnection(w http.ResponseWriter, r *http.Request, topic string, initMsg any) error {
	num := rand.Int63() // later replace with principal's address
	id := fmt.Sprintf("%d_%d", num, now.Now().UnixNano())

	p.pool.lock.Lock()
	defer p.pool.lock.Unlock()

	if _, ok := p.pool.conns[num]; ok {
		if _, ok := p.pool.conns[num][id]; ok {
			return ErrFailedToConstructId
		}
	}

	connection, err := p.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}
	wsConn := &conn{
		id:        id,
		num:       num,
		conn:      connection,
		pool:      p,
		closeOnce: &sync.Once{},
		writeLock: &sync.Mutex{},
		subLock:   &sync.Mutex{},
		topic:     topic,
	}
	if _, ok := p.pool.conns[num]; !ok {
		p.pool.conns[num] = map[string]*conn{}
	}
	p.pool.conns[num][id] = wsConn

	go wsConn.listen()
	go wsConn.pingPong()

	if initMsg != nil {
		wsConn.sendJson(initMsg)
	}

	return nil
}

func (p *wsPool) remove(num int64, id string) {
	rolePool := p.pool

	rolePool.lock.Lock()
	defer rolePool.lock.Unlock()

	delete(rolePool.conns[num], id)
	if len(rolePool.conns[num]) == 0 {
		delete(rolePool.conns, num)
	}
}

func (p *wsPool) SendTopicSub(topic string, data any) {
	p.pool.lock.RLock()
	defer p.pool.lock.RUnlock()

	for _, set := range p.pool.conns {
		for _, c := range set {
			if c.subbedOnTopic(topic) {
				c.sendJson(data)
			}
		}
	}
}

func (p *wsPool) SendUserSub(id int64, data any) {
	p.pool.lock.RLock()
	defer p.pool.lock.RUnlock()

	for _, c := range p.pool.conns[id] {
		c.sendJson(data)
	}
}

func (p *wsPool) Shutdown() {
	wg := &sync.WaitGroup{}
	p.pool.lock.Lock()
	for id := range p.pool.conns {
		for _, c := range p.pool.conns[id] {
			wg.Add(1)
			go func(wsConn *conn) {
				wsConn.close()
				wg.Done()
			}(c)
		}
	}
	p.pool.lock.Unlock()
	wg.Wait()
}
