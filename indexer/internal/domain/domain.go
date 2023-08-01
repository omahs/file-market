package domain

import (
	"flag"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/log"
)

var (
	logger = log.GetLogger()
	cfg    *config.Config
)

func init() {
	var cfgPath string
	flag.StringVar(&cfgPath, "cfg", "configs/local", "config path")
	flag.Parse()

	// initializing config, basically sets values from yml configs and env into a struct
	var err error
	cfg, err = config.Init(cfgPath)
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to init config", nil)
	}
}

func MapSlice[T1, T2 any](input []T1, f func(T1) T2) (output []T2) {
	output = make([]T2, 0, len(input))
	for _, v := range input {
		output = append(output, f(v))
	}
	return output
}
