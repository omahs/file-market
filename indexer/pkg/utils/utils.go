package utils

import (
	"github.com/ethereum/go-ethereum/params"
	"math/big"
)

func ParseEth(wei *big.Int) *big.Float {
	return new(big.Float).Quo(new(big.Float).SetInt(wei), big.NewFloat(params.Ether))
}
