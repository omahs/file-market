package mail

import (
	"fmt"
	"github.com/jordan-wright/email"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"net/smtp"
)

const (
	gmailSmtpServer = "smtp.gmail.com:587"
)

type EmailSender interface {
	SendEmail(subject, content, tag string, to, cc, bcc []string, attachments []Attachment) error
}

type Attachment struct {
	Name        string
	Content     string
	ContentType string
	ContentID   string
}

type GmailSender struct {
	smtpHost     string
	name         string
	fromAddress  string
	fromPassword string
}

func NewGmailSender(cfg *config.EmailSenderConfig) EmailSender {
	return &GmailSender{
		smtpHost:     "smtp.gmail.com",
		name:         cfg.Name,
		fromAddress:  cfg.Address,
		fromPassword: cfg.Password,
	}
}

func (s *GmailSender) SendEmail(subject, content, tag string, to, cc, bcc []string, attachments []Attachment) error {
	e := email.NewEmail()
	e.From = fmt.Sprintf("%s <%s>", s.name, s.fromAddress)
	e.Subject = subject
	e.HTML = []byte(content)
	e.To = to
	e.Cc = cc
	e.Bcc = bcc

	auth := smtp.PlainAuth("", s.fromAddress, s.fromPassword, s.smtpHost)
	return e.Send(gmailSmtpServer, auth)
}
