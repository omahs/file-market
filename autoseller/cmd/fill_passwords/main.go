package main

import (
	"bytes"
	"context"
	"encoding/csv"
	"flag"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
	"os"
)

func main() {
	var addr, pass, in string
	flag.StringVar(&addr, "addr", "", "")
	flag.StringVar(&pass, "pass", "", "")
	flag.StringVar(&in, "in", "", "")
	flag.Parse()
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
	})
	data, err := os.ReadFile(in)
	if err != nil {
		log.Panicln(err)
	}
	reader := csv.NewReader(bytes.NewReader(data))
	records, err := reader.ReadAll()
	if err != nil {
		log.Panicln(err)
	}
	for _, r := range records[1:] {
		hash, password := r[1], r[2]
		if err := rdb.Set(context.Background(), fmt.Sprintf("autoseller.keys.%s", hash), password, redis.KeepTTL); err != nil {
			log.Panicln(err)
		}
	}
}
