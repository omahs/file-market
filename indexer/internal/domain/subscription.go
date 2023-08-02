package domain

import "github.com/mark3d-xyz/mark3d/indexer/models"

type EFTSubMessage struct {
	Event    string
	Token    *Token
	Transfer *Transfer
	Order    *Order
}

func EFTSubMessageToModel(m *EFTSubMessage) *models.EFTSubscriptionMessage {
	return &models.EFTSubscriptionMessage{
		Event:    m.Event,
		Order:    OrderToModel(m.Order),
		Token:    TokenToModel(m.Token),
		Transfer: TransferToModel(m.Transfer),
	}
}
