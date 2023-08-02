package domain

import "github.com/mark3d-xyz/mark3d/indexer/models"

type EFTSubMessage struct {
	Event      string
	IsApproved bool
	Token      *Token
	Transfer   *Transfer
	Order      *Order
}

func EFTSubMessageToModel(m *EFTSubMessage) *models.EFTSubscriptionMessage {
	return &models.EFTSubscriptionMessage{
		Event:      m.Event,
		IsApproved: m.IsApproved,
		Order:      OrderToModel(m.Order),
		Token:      TokenToModel(m.Token),
		Transfer:   TransferToModel(m.Transfer),
	}
}
