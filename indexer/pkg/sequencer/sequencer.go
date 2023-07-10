package sequencer

import (
	"context"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/go-redis/redis/v8"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/retry"
	"log"
	"strconv"
	"strings"
	"sync"
	"time"
)

var (
	EmptySetErr = errors.New("set is empty")
)

type Config struct {
	KeyPrefix          string
	TokenIdTTL         time.Duration
	CheckInterval      time.Duration
	SwitchTokenTimeout time.Duration
}

type Sequencer struct {
	Cfg    *Config
	client *redis.Client

	lastCheck time.Time
	checkMu   sync.Mutex
}

func New(cfg *Config, client *redis.Client) *Sequencer {
	return &Sequencer{
		Cfg:    cfg,
		client: client,
	}
}

func (s *Sequencer) Acquire(ctx context.Context, collectionAddr common.Address, suffix string, walletAddr common.Address) (int64, error) {
	if err := s.releaseTokens(ctx, collectionAddr, suffix); err != nil {
		log.Println("failed to releaseTokens in sequencer: ", err)
	}

	lastTokenRecordExist := true
	lastTokenIdStr, err := s.client.HGet(
		ctx,
		s.getLastIdKey(collectionAddr, suffix),
		strings.ToLower(walletAddr.String()),
	).Result()
	if err != nil && err != redis.Nil {
		return 0, fmt.Errorf("failed to get lastToken: %w", err)
	}
	if err == redis.Nil {
		lastTokenRecordExist = false
	}

	var lastTokenId int64
	if lastTokenRecordExist {
		var err error
		lastTokenId, err = strconv.ParseInt(lastTokenIdStr, 10, 64)
		if err != nil {
			return 0, fmt.Errorf("failed to parse lastTokenId: %w", err)
		}
		lastTokenTimerKey := s.getTimerKey(collectionAddr, suffix, walletAddr, lastTokenId)
		timestamp, err := s.getTimerTimestamp(ctx, lastTokenTimerKey)
		if err != nil && err != redis.Nil {
			return 0, fmt.Errorf("failed to get last token id timer value: %w", err)
		}
		if err != redis.Nil {
			if time.Since(time.Unix(timestamp, 0)) < s.Cfg.SwitchTokenTimeout {
				return lastTokenId, nil
			}
		}
	}

	if s.Count(ctx, collectionAddr, suffix) == 0 {
		if lastTokenRecordExist {
			return lastTokenId, nil
		}
		return 0, EmptySetErr
	}

	tokenId, ok := s.popRandom(ctx, collectionAddr, suffix)
	if !ok {
		return 0, errors.New("failed to get random")
	}
	timerKey := s.getTimerKey(collectionAddr, suffix, walletAddr, tokenId)
	if _, err := s.client.Get(ctx, timerKey).Result(); err == nil {
		log.Printf("shouldn't happen! `popRandom` returned tokenId, but timer for it exists. [%s]", timerKey)
		return 0, fmt.Errorf("tokenId was already acquired, so timer for it exists: %w", err)
	}

	_, err = retry.OnErrors(ctx, retry.Options{
		Fn: func(ctx context.Context, args ...any) (any, error) {
			if err := s.client.Set(ctx, timerKey, time.Now().Unix(), 0).Err(); err != nil {
				return nil, err
			}
			if err := s.client.HSet(
				ctx,
				s.getLastIdKey(collectionAddr, suffix),
				strings.ToLower(walletAddr.String()),
				tokenId,
			).Err(); err != nil {
				return nil, err
			}

			// delete previous timers
			keyStr := fmt.Sprintf("%s.timer.%s.*", s.getKey(collectionAddr, suffix), strings.ToLower(walletAddr.String()))
			keys, err := s.client.Keys(ctx, keyStr).Result()
			if err != nil {
				return 0, err
			}

			for _, key := range keys {
				if key == timerKey {
					continue
				}
				// Will 'expire' on the next cycle
				if err := s.client.Set(ctx, key, 0, 0).Err(); err != nil {
					return 0, err
				}
			}
			return nil, nil
		},
		RetryOnAnyError: true,
		Backoff: &retry.ExponentialBackoff{
			InitialInterval: 1 * time.Second,
			RandFactor:      0.5,
			Multiplier:      2,
			MaxInterval:     5 * time.Second,
		},
		MaxElapsedTime: 5 * time.Second,
	})
	if err != nil {
		return 0, err
	}

	return tokenId, nil
}

func (s *Sequencer) DeleteTokenID(ctx context.Context, collectionAddr common.Address, suffix string, tokenId int64) error {
	timerKey := fmt.Sprintf("%s.timer.*.%d", s.getKey(collectionAddr, suffix), tokenId)
	keys, err := s.client.Keys(ctx, timerKey).Result()
	if err != nil && err != redis.Nil {
		return err
	}
	var okQueue bool
	if err != redis.Nil {
		params := strings.Split(keys[0], ".")
		walletAddr := common.HexToAddress(params[4])
		okQueue = s.deleteFromQueue(ctx, collectionAddr, walletAddr, suffix, tokenId)

		// delete last_id record
		lastIdStr, err := s.client.HGet(ctx, s.getLastIdKey(collectionAddr, suffix), strings.ToLower(walletAddr.String())).Result()
		if err != nil && err != redis.Nil {
			return fmt.Errorf("failed to get lastId: %w", err)
		}
		if err != redis.Nil {
			lastId, err := strconv.ParseInt(lastIdStr, 10, 64)
			if err != nil {
				return fmt.Errorf("failed to parse str: %w", err)
			}
			if lastId == tokenId {
				if err = s.client.HDel(ctx, s.getLastIdKey(collectionAddr, suffix), strings.ToLower(walletAddr.String())).Err(); err != nil {
					return err
				}
			}
		}
	}

	okSet := s.deleteFromSet(ctx, collectionAddr, suffix, tokenId)
	if !okSet && !okQueue {
		return errors.New("tokenId does not exists")
	}
	return nil
}

func (s *Sequencer) Count(ctx context.Context, collectionAddr common.Address, suffix string) int64 {
	key := s.getKey(collectionAddr, suffix)
	length, err := s.client.SCard(ctx, key).Result()
	if err != nil {
		return 0
	}

	return length
}

func (s *Sequencer) popRandom(ctx context.Context, collectionAddr common.Address, suffix string) (int64, bool) {
	key := s.getKey(collectionAddr, suffix)
	val, err := s.client.SPop(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			log.Printf("empty set for address: %s", key)
			return 0, false
		}
		log.Println("redis SPop error")
		return 0, false
	}

	num, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		log.Println("failed to parse val from redis: ", val)
		return 0, false
	}

	return num, true
}

func (s *Sequencer) deleteFromSet(ctx context.Context, collectionAddr common.Address, suffix string, tokenId int64) bool {
	key := s.getKey(collectionAddr, suffix)
	val, err := s.client.SRem(ctx, key, tokenId).Result()
	if err != nil {
		return false
	}
	if val == 0 {
		return false
	}

	return true
}

func (s *Sequencer) releaseTokens(ctx context.Context, collectionAddr common.Address, suffix string) error {
	s.checkMu.Lock()
	defer s.checkMu.Unlock()

	if time.Since(s.lastCheck) <= s.Cfg.CheckInterval {
		return nil
	}

	keyStr := fmt.Sprintf("%s.timer.*.*", s.getKey(collectionAddr, suffix))
	keys, err := s.client.Keys(ctx, keyStr).Result()
	if err != nil {
		return err
	}

	var globalErr error
	now := time.Now()
	for _, key := range keys {
		timestamp, err := s.getTimerTimestamp(ctx, key)
		if err != nil {
			globalErr = errors.Join(globalErr, fmt.Errorf("failed to get timestamp: \"%s\"", key))
			continue
		}

		if time.Since(time.Unix(timestamp, 0)) > s.Cfg.TokenIdTTL {
			padding := len(keyStr) - 3 // remove `*.*`
			params := strings.Split(key[padding:], ".")
			walletAddrStr, tokenIdStr := params[0], params[1]
			tokenId, err := strconv.ParseInt(tokenIdStr, 10, 64)
			if err != nil {
				globalErr = errors.Join(globalErr, err)
			}
			walletAddr := common.HexToAddress(walletAddrStr)

			s.appendTokenId(ctx, collectionAddr, suffix, tokenId)
			if ok := s.deleteFromQueue(ctx, collectionAddr, walletAddr, suffix, tokenId); !ok {
				globalErr = errors.Join(globalErr, fmt.Errorf("failed to delete key from redis: %s", key))
			}
		}
	}

	if globalErr != nil {
		return err
	}

	s.lastCheck = now

	return nil
}

func (s *Sequencer) appendTokenId(ctx context.Context, collectionAddr common.Address, suffix string, tokenId int64) {
	key := s.getKey(collectionAddr, suffix)
	if err := s.client.SAdd(ctx, key, tokenId).Err(); err != nil {
		log.Printf("failed to append to Redis: %v", err)
		return
	}
}

func (s *Sequencer) deleteFromQueue(ctx context.Context, collectionAddr, walletAddr common.Address, suffix string, tokenId int64) bool {
	key := fmt.Sprintf(
		"%s.timer.%s.%d",
		s.getKey(collectionAddr, suffix),
		strings.ToLower(walletAddr.String()),
		tokenId,
	)
	keysRemoved, err := s.client.Del(ctx, key).Result()
	if err != nil {
		log.Println("failed ot delete key from redis: ", key)
		return false
	}
	if keysRemoved <= 0 {
		return false
	}
	return true
}

func (s *Sequencer) getKey(collectionAddr common.Address, suffix string) string {
	collectionAddrStr := strings.ToLower(collectionAddr.String())
	if suffix == "" {
		return fmt.Sprintf("%s.%s", s.Cfg.KeyPrefix, collectionAddrStr)
	}
	return fmt.Sprintf("%s.%s.%s", s.Cfg.KeyPrefix, collectionAddrStr, suffix)
}

func (s *Sequencer) getLastIdKey(collectionAddr common.Address, suffix string) string {
	collectionAddrStr := strings.ToLower(collectionAddr.String())
	if suffix == "" {
		return fmt.Sprintf("%s.%s.last_token_id", s.Cfg.KeyPrefix, collectionAddrStr)
	}
	return fmt.Sprintf("%s.%s.%s.last_token_id", s.Cfg.KeyPrefix, collectionAddrStr, suffix)
}

func (s *Sequencer) getTimerKey(collectionAddr common.Address, suffix string, walletAddr common.Address, tokenId int64) string {
	return fmt.Sprintf(
		"%s.timer.%s.%d",
		s.getKey(collectionAddr, suffix),
		strings.ToLower(walletAddr.String()),
		tokenId,
	)
}

func (s *Sequencer) getTimerTimestamp(ctx context.Context, key string) (int64, error) {
	timestampStr, err := s.client.Get(ctx, key).Result()
	if err != nil {
		return 0, err
	}

	timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse timestamp: \"%s\"", timestampStr)
	}

	return timestamp, nil
}
