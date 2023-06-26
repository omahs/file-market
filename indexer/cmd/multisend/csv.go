package main

import (
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
)

func main() {
	var path, out string
	flag.StringVar(&path, "path", "", "")
	flag.StringVar(&out, "out", "", "")
	flag.Parse()

	f, err := os.Open(path)
	if err != nil {
		log.Panicln(err)
	}
	defer f.Close()
	reader := csv.NewReader(f)
	_, err = reader.Read()
	if err != nil {
		log.Panicln(err)
	}
	var addresses []string
	addressRegExp := regexp.MustCompile("0x[0-9a-fA-F]{40}")
	set := make(map[string]any)
	for {
		next, err := reader.Read()
		if err != nil {
			log.Println("read failed", err)
			break
		}
		address := strings.TrimSpace(next[8])
		address = strings.ToLower(address)
		if !addressRegExp.MatchString(address) {
			continue
		}
		if _, ok := set[address]; ok {
			continue
		}
		set[address] = true
		addresses = append(addresses, address)
	}
	fmt.Println("unique addresses", len(addresses))
	res, err := json.Marshal(addresses)
	if err != nil {
		log.Panicln(err)
	}
	if err := os.WriteFile(out, res, 0644); err != nil {
		log.Panicln(err)
	}
}
