package domain

import "github.com/ethereum/go-ethereum/common"

type UserRole uint8

const (
	UserRoleUser UserRole = iota + 1
	UserRoleAdmin
)

type User struct {
	Address common.Address
	Role    UserRole
}
