package repository

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
	"strings"
)

// GetCollectionsByOwnerAddress returns owned collections or collections of owned tokens
func (p *postgres) GetCollectionsByOwnerAddress(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
	lastCollectionAddress *common.Address,
	limit int,
) ([]*domain.Collection, error) {
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		total_orders AS (
			SELECT t.collection_address, COUNT(*) AS total
			FROM orders AS o
				  JOIN transfers t ON o.transfer_id = t.id
				  JOIN latest_transfer_statuses lts ON lts.transfer_id = t.id
			WHERE lts.rank = 1 AND
				 lts.status IN ('Created', 'Drafted') AND
				 o.visibility = 'Visible' AND
				 o.exchange_address != '0x' AND
			 	 NOT (t.collection_address=$3 AND t.number=1) AND
				 (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_owners AS (
			SELECT t.collection_address, COUNT(DISTINCT(t.owner)) AS total
			FROM tokens t
			WHERE (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_tokens AS (
			SELECT t.collection_address, COUNT(*) as total
			FROM tokens t
			WHERE t.meta_uri != '' AND
				  t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
				  (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		)
		SELECT c.address, c.creator, c.owner, c.name, c.token_id, c.meta_uri, c.description, c.image, c.block_number,
			COALESCE(tor.total, 0) as orders_count,
			COALESCE(tow.total, 0) as owners_count,
			COALESCE(tot.total, 0) as tokens_count
		FROM collections c
				 LEFT JOIN total_orders AS tor ON tor.collection_address = c.address
				 LEFT JOIN total_owners AS tow ON tow.collection_address = c.address
				 LEFT JOIN total_tokens AS tot ON tot.collection_address = c.address
		WHERE (c.owner=$1 OR
		       EXISTS (SELECT 1
		               FROM tokens AS t
		               WHERE t.collection_address=c.address AND
		                     t.owner=$1 AND
		                     (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
		               )
		    ) OR
		    c.address > $4 AND
            c.address = $2 AND 
			c.address NOT IN (SELECT collection_address FROM rejected_collections)
		ORDER BY c.address
		LIMIT $5
	`

	lastCollectionAddressStr := ""
	if lastCollectionAddress != nil {
		lastCollectionAddressStr = strings.ToLower(lastCollectionAddress.String())
	}
	if limit == 0 {
		limit = 10000
	}

	rows, err := tx.Query(ctx, query,
		strings.ToLower(address.String()),
		strings.ToLower(p.cfg.publicCollectionAddress.String()),
		strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()),
		lastCollectionAddressStr,
		limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Collection
	for rows.Next() {
		var collectionAddress, creator, owner, tokenId string
		c := &domain.Collection{}
		if err := rows.Scan(
			&collectionAddress,
			&creator,
			&owner,
			&c.Name,
			&tokenId,
			&c.MetaUri,
			&c.Description,
			&c.Image,
			&c.BlockNumber,
			&c.OrdersCount,
			&c.OwnersCount,
			&c.TokensCount,
		); err != nil {
			return nil, err
		}

		c.Address = common.HexToAddress(collectionAddress)
		c.Owner = common.HexToAddress(owner)
		c.Creator = common.HexToAddress(creator)

		var ok bool
		c.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}

		switch c.Address {
		case p.cfg.publicCollectionAddress:
			c.Type = models.CollectionTypePublicCollection
		case p.cfg.fileBunniesCollectionAddress:
			c.Type = models.CollectionTypeFileBunniesCollection
		default:
			c.Type = models.CollectionTypeFileMarketCollection
		}
		res = append(res, c)
	}
	return res, nil
}

func (p *postgres) GetCollectionsByOwnerAddressTotal(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
) (uint64, error) {
	// language=PostgreSQL
	query := `
		SELECT COUNT(*) AS total
		FROM collections AS c 
		WHERE (owner=$1 OR 
		       EXISTS (SELECT 1 
		               FROM tokens AS t 
		               WHERE t.collection_address=c.address AND 
		                     t.owner=$1 AND
		                     (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
					   )
		       ) OR 
		       c.address=$2 AND
		       address NOT IN (SELECT collection_address FROM rejected_collections)
	`
	var total uint64
	row := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
		strings.ToLower(p.cfg.publicCollectionAddress.String()),
	)
	if err := row.Scan(&total); err != nil {
		return 0, err
	}

	return total, nil
}

func (p *postgres) GetCollection(ctx context.Context,
	tx pgx.Tx, contractAddress common.Address) (*domain.Collection, error) {
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		filtered_orders AS (
			SELECT *
			FROM orders AS o
			    JOIN transfers t ON o.transfer_id = t.id
			    JOIN latest_transfer_statuses lts ON lts.transfer_id = t.id
			WHERE lts.rank = 1 AND
					lts.status IN ('Created', 'Drafted') AND
					o.visibility = 'Visible' AND
					o.exchange_address != '0x' AND
			 	 	NOT (t.collection_address=$2 AND t.number=1) AND
				 	(t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
		),
		total_orders AS (
			SELECT fo.collection_address, COUNT(*) AS total
			FROM filtered_orders fo
			GROUP BY fo.collection_address
		),
		total_owners AS (
			SELECT t.collection_address, COUNT(DISTINCT(t.owner)) AS total
			FROM tokens t
			WHERE (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_tokens AS (
			SELECT t.collection_address, COUNT(*) as total
			FROM tokens t
			WHERE t.meta_uri != '' AND
				  t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
				  (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		sales_volumes AS (
			SELECT t.collection_address, SUM(o.price::NUMERIC)::VARCHAR(255) AS volume
			FROM orders o
			    JOIN transfers t on o.transfer_id = t.id
			    RIGHT JOIN order_statuses os on o.id = os.order_id
			WHERE os.status='Finished' AND
			      t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
			      (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
     	),
		floor_prices AS (
			SELECT fo.collection_address, fo.price
			FROM filtered_orders fo
			WHERE fo.price =(
					SELECT price
					FROM filtered_orders
					WHERE collection_address = fo.collection_address
					ORDER BY length(price),
							 price
					LIMIT 1
				)
			GROUP BY fo.collection_address,
					 fo.price
		)
		SELECT c.address, c.creator, c.owner, c.name, c.token_id, c.meta_uri, c.description, c.image, c.block_number,
			COALESCE(tor.total, 0) as orders_count,
			COALESCE(tow.total, 0) as owners_count,
			COALESCE(tot.total, 0) as tokens_count,
       		COALESCE(sv.volume, '0') as sales_volume,
       		COALESCE(fp.price, '0') as floor_price
		FROM collections c
		    LEFT JOIN total_orders AS tor ON tor.collection_address = c.address
		    LEFT JOIN total_owners AS tow ON tow.collection_address = c.address
		    LEFT JOIN total_tokens AS tot ON tot.collection_address = c.address
		    LEFT JOIN sales_volumes AS sv ON sv.collection_address = c.address
         	LEFT JOIN floor_prices AS fp ON fp.collection_address = c.address
		WHERE c.address = $1 AND
			  c.address NOT IN (SELECT collection_address FROM rejected_collections)
`
	row := tx.QueryRow(ctx, query,
		strings.ToLower(contractAddress.String()),
		strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()),
	)
	var collectionAddress, creator, owner, tokenId, salesVolume, floorPrice string
	c := &domain.Collection{}
	if err := row.Scan(
		&collectionAddress,
		&creator,
		&owner,
		&c.Name,
		&tokenId,
		&c.MetaUri,
		&c.Description,
		&c.Image,
		&c.BlockNumber,
		&c.OrdersCount,
		&c.OwnersCount,
		&c.TokensCount,
		&salesVolume,
		&floorPrice,
	); err != nil {
		return nil, err
	}

	c.Address, c.Owner, c.Creator = contractAddress, common.HexToAddress(creator), common.HexToAddress(owner)
	var ok bool
	c.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
	}
	c.SalesVolume, ok = big.NewInt(0).SetString(salesVolume, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", salesVolume)
	}
	c.FloorPrice, ok = big.NewInt(0).SetString(floorPrice, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", floorPrice)
	}

	switch c.Address {
	case p.cfg.publicCollectionAddress:
		c.Type = models.CollectionTypePublicCollection
	case p.cfg.fileBunniesCollectionAddress:
		c.Type = models.CollectionTypeFileBunniesCollection
	default:
		c.Type = models.CollectionTypeFileMarketCollection
	}
	return c, nil
}

func (p *postgres) GetCollections(ctx context.Context, tx pgx.Tx, lastCollectionAddress *common.Address, limit int) ([]*domain.Collection, error) {
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		total_orders AS (
			SELECT t.collection_address, COUNT(*) AS total
			FROM orders AS o
				  JOIN transfers t ON o.transfer_id = t.id
				  JOIN latest_transfer_statuses lts ON lts.transfer_id = t.id
			WHERE lts.rank = 1 AND
				 lts.status IN ('Created', 'Drafted') AND
				 o.visibility = 'Visible' AND
				 o.exchange_address != '0x' AND
			 	 NOT (t.collection_address=$3 AND t.number=1) AND
				 (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_owners AS (
			SELECT t.collection_address, COUNT(DISTINCT(t.owner)) AS total
			FROM tokens t
			WHERE (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_tokens AS (
			SELECT t.collection_address, COUNT(*) as total
			FROM tokens t
			WHERE t.meta_uri != '' AND
				  t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
				  (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		)
		SELECT c.address, c.creator, c.owner, c.name, c.token_id, c.meta_uri, c.description, c.image, c.block_number,
			COALESCE(tor.total, 0) as orders_count,
			COALESCE(tow.total, 0) as owners_count,
			COALESCE(tot.total, 0) as tokens_count
		FROM collections c
				 LEFT JOIN total_orders AS tor ON tor.collection_address = c.address
				 LEFT JOIN total_owners AS tow ON tow.collection_address = c.address
				 LEFT JOIN total_tokens AS tot ON tot.collection_address = c.address
		WHERE c.address > $1 AND
			  c.address NOT IN (SELECT collection_address FROM rejected_collections)
		ORDER BY c.address
		LIMIT $2
	`

	lastCollectionAddressStr := ""
	if lastCollectionAddress != nil {
		lastCollectionAddressStr = strings.ToLower(lastCollectionAddress.String())
	}
	if limit == 0 {
		limit = 10000
	}

	rows, err := tx.Query(ctx, query,
		lastCollectionAddressStr,
		limit,
		strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Collection
	for rows.Next() {
		var collectionAddress, creator, owner, tokenId string
		c := &domain.Collection{}
		if err := rows.Scan(
			&collectionAddress,
			&creator,
			&owner,
			&c.Name,
			&tokenId,
			&c.MetaUri,
			&c.Description,
			&c.Image,
			&c.BlockNumber,
			&c.OrdersCount,
			&c.OwnersCount,
			&c.TokensCount,
		); err != nil {
			return nil, err
		}

		c.Address = common.HexToAddress(collectionAddress)
		c.Owner = common.HexToAddress(owner)
		c.Creator = common.HexToAddress(creator)

		var ok bool
		c.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}

		switch c.Address {
		case p.cfg.publicCollectionAddress:
			c.Type = models.CollectionTypePublicCollection
		case p.cfg.fileBunniesCollectionAddress:
			c.Type = models.CollectionTypeFileBunniesCollection
		default:
			c.Type = models.CollectionTypeFileMarketCollection
		}
		res = append(res, c)
	}
	return res, nil
}

func (p *postgres) GetCollectionsTotal(ctx context.Context, tx pgx.Tx) (uint64, error) {
	// language=PostgreSQL
	query := `
		SELECT COUNT(*)
		FROM collections
		WHERE address NOT IN (SELECT collection_address FROM rejected_collections)
	`

	var total uint64
	if err := tx.QueryRow(ctx, query).Scan(&total); err != nil {
		return 0, err
	}

	return total, nil

}

func (p *postgres) GetCollectionByTokenId(
	ctx context.Context,
	tx pgx.Tx,
	tokenId *big.Int,
) (*domain.Collection, error) {
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		filtered_orders AS (
			SELECT *
			FROM orders AS o
			    JOIN transfers t ON o.transfer_id = t.id
			    JOIN latest_transfer_statuses lts ON lts.transfer_id = t.id
			WHERE lts.rank = 1 AND
					lts.status IN ('Created', 'Drafted') AND
					o.visibility = 'Visible' AND
					o.exchange_address != '0x' AND
			 	 	NOT (t.collection_address=$2 AND t.number=1) AND
				 	(t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
		),
		total_orders AS (
			SELECT fo.collection_address, COUNT(*) AS total
			FROM filtered_orders fo
			GROUP BY fo.collection_address
		),
		total_owners AS (
			SELECT t.collection_address, COUNT(DISTINCT(t.owner)) AS total
			FROM tokens t
			WHERE (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		total_tokens AS (
			SELECT t.collection_address, COUNT(*) as total
			FROM tokens t
			WHERE t.meta_uri != '' AND
				  t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
				  (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
		),
		sales_volumes AS (
			SELECT t.collection_address, SUM(o.price::NUMERIC)::VARCHAR(255) AS volume
			FROM orders o
			    JOIN transfers t on o.transfer_id = t.id
			    RIGHT JOIN order_statuses os on o.id = os.order_id
			WHERE os.status='Finished' AND
			      t.collection_address NOT IN (SELECT collection_address FROM rejected_collections) AND
			      (t.token_id, t.collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
			GROUP BY t.collection_address
     	),
		floor_prices AS (
			SELECT fo.collection_address, fo.price
			FROM filtered_orders fo
			WHERE fo.price =(
					SELECT price
					FROM filtered_orders
					WHERE collection_address = fo.collection_address
					ORDER BY length(price),
							 price
					LIMIT 1
				)
			GROUP BY fo.collection_address,
					 fo.price
		)
		SELECT c.address, c.creator, c.owner, c.name, c.token_id, c.meta_uri, c.description, c.image, c.block_number,
			COALESCE(tor.total, 0) as orders_count,
			COALESCE(tow.total, 0) as owners_count,
			COALESCE(tot.total, 0) as tokens_count,
       		COALESCE(sv.volume, '0') as sales_volume,
       		COALESCE(fp.price, '0') as floor_price
		FROM collections c
		    LEFT JOIN total_orders AS tor ON tor.collection_address = c.address
		    LEFT JOIN total_owners AS tow ON tow.collection_address = c.address
		    LEFT JOIN total_tokens AS tot ON tot.collection_address = c.address
		    LEFT JOIN sales_volumes AS sv ON sv.collection_address = c.address
         	LEFT JOIN floor_prices AS fp ON fp.collection_address = c.address
		WHERE c.token_id = $1 AND
			  c.address NOT IN (SELECT collection_address FROM rejected_collections)

	`
	row := tx.QueryRow(ctx, query, tokenId.String(), strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()))
	var collectionAddress, creator, owner, salesVolume, floorPrice string
	c := &domain.Collection{
		TokenId: tokenId,
	}

	if err := row.Scan(
		&collectionAddress,
		&creator,
		&owner,
		&c.Name,
		&c.MetaUri,
		&c.Description,
		&c.Image,
		&c.BlockNumber,
		&c.OrdersCount,
		&c.OwnersCount,
		&c.TokensCount,
		&salesVolume,
		&floorPrice,
	); err != nil {
		return nil, err
	}

	c.Address = common.HexToAddress(collectionAddress)
	c.Owner = common.HexToAddress(owner)
	c.Creator = common.HexToAddress(creator)

	var ok bool
	c.SalesVolume, ok = big.NewInt(0).SetString(salesVolume, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", salesVolume)
	}
	c.FloorPrice, ok = big.NewInt(0).SetString(floorPrice, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", floorPrice)
	}

	switch c.Address {
	case p.cfg.publicCollectionAddress:
		c.Type = models.CollectionTypePublicCollection
	case p.cfg.fileBunniesCollectionAddress:
		c.Type = models.CollectionTypeFileBunniesCollection
	default:
		c.Type = models.CollectionTypeFileMarketCollection
	}
	return c, nil
}

func (p *postgres) InsertCollection(ctx context.Context, tx pgx.Tx,
	collection *domain.Collection) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO collections VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		strings.ToLower(collection.Address.String()),
		strings.ToLower(collection.Creator.String()),
		strings.ToLower(collection.Owner.String()),
		collection.Name,
		collection.TokenId.String(),
		collection.MetaUri,
		collection.Description,
		collection.Image,
		collection.BlockNumber,
	); err != nil {
		return err
	}
	return nil
}

func (p *postgres) InsertCollectionTransfer(ctx context.Context, tx pgx.Tx,
	collectionAddress common.Address, transfer *domain.CollectionTransfer) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO collection_transfers VALUES ($1,$2,$3,$4,$5)`,
		strings.ToLower(collectionAddress.String()), transfer.Timestamp,
		strings.ToLower(transfer.From.String()), strings.ToLower(transfer.To.String()),
		strings.ToLower(transfer.TxId.String())); err != nil {
		return err
	}
	return nil
}

func (p *postgres) UpdateCollection(ctx context.Context, tx pgx.Tx,
	collection *domain.Collection) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `UPDATE collections SET owner=$1,name=$2,meta_uri=$3,block_number=$4 WHERE address=$5`,
		strings.ToLower(collection.Owner.String()), collection.Name, collection.MetaUri, collection.BlockNumber,
		strings.ToLower(collection.Address.String())); err != nil {
		return err
	}
	return nil
}

func (p *postgres) CollectionTransferExists(ctx context.Context, tx pgx.Tx, txId string) (bool, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT COUNT(*) FROM collection_transfers WHERE tx_id=$1`, txId)
	var res int64
	if err := row.Scan(&res); err != nil {
		return false, err
	}
	return res > 0, nil
}

func (p *postgres) GetFileBunniesStats(
	ctx context.Context,
	tx pgx.Tx,
) ([]*domain.CollectionStats, error) {
	// language=PostgreSQL
	query := `
		SELECT
			SUM(CASE WHEN token_id::bigint BETWEEN 0 AND 5999 THEN 1 ELSE 0 END) AS common_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 0 AND 5999 AND meta_uri != '' THEN 1 ELSE 0 END) AS common_bought_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 6000 AND 6999 THEN 1 ELSE 0 END) AS uncommon_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 6000 AND 6999 AND meta_uri != '' THEN 1 ELSE 0 END) AS uncommon_bought_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 7000 AND 9999 THEN 1 ELSE 0 END) AS payed_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 7000 AND 9999 AND meta_uri != '' THEN 1 ELSE 0 END) AS payed_bought_amount
		FROM public.tokens
		WHERE collection_address=$1 AND
		      (token_id, collection_address) NOT IN (SELECT token_id, collection_address FROM rejected_tokens)
	`
	stats := make([]int, 6)
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()),
	).Scan(
		&stats[0],
		&stats[1],
		&stats[2],
		&stats[3],
		&stats[4],
		&stats[5],
	); err != nil {
		return nil, err
	}

	return []*domain.CollectionStats{
		{Name: "common.minted_amount", Value: float64(stats[0])},
		{Name: "common.bought_amount", Value: float64(stats[1])},
		{Name: "uncommon.minted_amount", Value: float64(stats[2])},
		{Name: "uncommon.bought_amount", Value: float64(stats[3])},
		{Name: "payed.minted_amount", Value: float64(stats[4])},
		{Name: "payed.bought_amount", Value: float64(stats[5])},
	}, nil
}
