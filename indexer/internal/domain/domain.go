package domain

import (
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
)

var (
	cfg *config.Config
)

func MapSlice[T1, T2 any](input []T1, f func(T1) T2) (output []T2) {
	output = make([]T2, 0, len(input))
	for _, v := range input {
		output = append(output, f(v))
	}
	return output
}

func SetConfig(c *config.Config) {
	cfg = c
}
