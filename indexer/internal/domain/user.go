package domain

import "github.com/ethereum/go-ethereum/common"

type User struct {
	Address common.Address
	Number  int
}
