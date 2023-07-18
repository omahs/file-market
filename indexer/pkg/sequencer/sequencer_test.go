package sequencer

//import (
//	"encoding/json"
//	"github.com/ethereum/go-ethereum/common"
//	"github.com/go-redis/redis/v8"
//	"log"
//	"net/http"
//	"strconv"
//	"testing"
//	"time"
//)
//
//func TestSeq(t *testing.T) {
//	client := redis.NewClient(&redis.Options{
//		Addr: "localhost:6379",
//	})
//	cfg := &Config{
//		KeyPrefix:          "sequencer",
//		TokenIdTTL:         3 * time.Minute,
//		CheckInterval:      30 * time.Second,
//		SwitchTokenTimeout: 1 * time.Minute,
//	}
//
//	//addr := common.HexToAddress("11")
//	//addr2 := common.HexToAddress("12")
//	//for i := 0; i < 10; i++ {
//	//	client.SAdd(context.TODO(), fmt.Sprintf("%s.%s.common", cfg.KeyPrefix, addr), i)
//	//	client.SAdd(context.TODO(), fmt.Sprintf("%s.%s.uncommon", cfg.KeyPrefix, addr), i)
//	//	client.SAdd(context.TODO(), fmt.Sprintf("%s.%s.common", cfg.KeyPrefix, addr2), i)
//	//	client.SAdd(context.TODO(), fmt.Sprintf("%s.%s.uncommon", cfg.KeyPrefix, addr2), i)
//	//}
//
//	seq := New(cfg, client)
//
//	// `curl "localhost/?address=1"`
//	// `curl -X POST "localhost/?address=1&tokenId=1"`
//	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
//		address := common.HexToAddress(r.URL.Query().Get("address"))
//		wallet := common.HexToAddress(r.URL.Query().Get("wallet"))
//		suffix := r.URL.Query().Get("suffix")
//
//		switch r.Method {
//		case http.MethodGet:
//			tokenId, err := seq.Acquire(r.Context(), address, suffix, wallet)
//			if err != nil {
//				http.Error(w, err.Error(), http.StatusInternalServerError)
//				return
//			}
//
//			json.NewEncoder(w).Encode(map[string]int64{"tokenId": tokenId})
//		case http.MethodPost:
//			tokenIdStr := r.URL.Query().Get("tokenId")
//			tokenId, _ := strconv.ParseInt(tokenIdStr, 10, 64)
//
//			if err := seq.DeleteTokenID(r.Context(), address, suffix, tokenId); err != nil {
//				http.Error(w, err.Error(), http.StatusInternalServerError)
//				return
//			}
//
//			json.NewEncoder(w).Encode(map[string]int64{"tokenId": tokenId})
//
//		default:
//			w.Write([]byte("Error"))
//		}
//	})
//
//	if err := http.ListenAndServe(":8080", nil); err != nil {
//		log.Panic(err)
//	}
//}
