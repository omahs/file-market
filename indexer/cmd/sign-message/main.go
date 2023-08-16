package main

import (
	"encoding/hex"
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum/crypto"
	"log"
)

func main() {
	var (
		key     string
		address string
		message string
	)
	flag.StringVar(&key, "key", "", "")
	flag.StringVar(&address, "address", "", "")
	flag.StringVar(&message, "message", "", "")
	flag.Parse()

	ecdsaKey, err := crypto.HexToECDSA(key)
	if err != nil {
		log.Panicln(err)
	}
	hash := crypto.Keccak256([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(message), message)))
	signature, err := crypto.Sign(hash, ecdsaKey)
	if err != nil {
		log.Panicln(err)
	}
	if signature[len(signature)-1] < 5 {
		signature[len(signature)-1] += 27
	}
	fmt.Println(hex.EncodeToString(signature))
}
