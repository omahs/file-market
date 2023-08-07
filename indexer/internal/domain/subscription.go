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
	var (
		order    *models.Order
		transfer *models.Transfer
		token    *models.Token
	)

	if m.Order != nil {
		order = OrderToModel(m.Order)
	}
	if m.Transfer != nil {
		transfer = TransferToModel(m.Transfer)
	}
	if m.Token != nil {
		token = TokenToModel(m.Token)
	}

	return &models.EFTSubscriptionMessage{
		Event:    m.Event,
		Order:    order,
		Token:    token,
		Transfer: transfer,
	}
}
