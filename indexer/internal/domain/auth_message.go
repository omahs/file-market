package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"time"
)

type AuthMessage struct {
	Address   common.Address
	Message   string
	CreatedAt time.Time
}
