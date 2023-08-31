package mail

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"io"
	"log"
	"net/http"
	"strings"
)

type postmarkHeader struct {
	Name  string `json:"Name"`
	Value string `json:"Value"`
}

// postmarkAttachment's Content is Hex encoded bytes
type postmarkAttachment struct {
	Name        string `json:"Name"`
	ContentID   string `json:"ContentID,omitempty"`
	Content     string `json:"Content"`
	ContentType string `json:"ContentType"`
}

type postmarkMetadata struct {
	Color    string `json:"color,omitempty"`
	ClientID string `json:"client-id,omitempty"`
}

type postmarkResponse struct {
	To          string `json:"To"`
	SubmittedAt string `json:"SubmittedAt"`
	MessageID   string `json:"MessageID"`
	ErrorCode   int    `json:"ErrorCode"`
	Message     string `json:"Message"`
}

type postmarkEmail struct {
	From          string               `json:"From,omitempty"`
	To            string               `json:"To,omitempty"`
	Cc            string               `json:"Cc,omitempty"`
	Bcc           string               `json:"Bcc,omitempty"`
	Subject       string               `json:"Subject,omitempty"`
	Tag           string               `json:"Tag,omitempty"`
	HtmlBody      string               `json:"HtmlBody,omitempty"`
	TextBody      string               `json:"TextBody,omitempty"`
	ReplyTo       string               `json:"ReplyTo,omitempty"`
	Headers       []postmarkHeader     `json:"Headers,omitempty"`
	TrackOpens    bool                 `json:"TrackOpens,omitempty"`
	TrackLinks    string               `json:"TrackLinks,omitempty"`
	Attachments   []postmarkAttachment `json:"Attachments,omitempty"`
	Metadata      postmarkMetadata     `json:"Metadata,omitempty"`
	MessageStream string               `json:"MessageStream,omitempty"`
}

type PostmarkappEmailSender struct {
	endpoint     string
	fromAddress  string
	fromPassword string
}

func NewPostmarkSender(cfg *config.EmailSenderConfig) EmailSender {
	return &PostmarkappEmailSender{
		endpoint:     "https://api.postmarkapp.com/email",
		fromAddress:  cfg.Address,
		fromPassword: cfg.Password,
	}
}

func (s *PostmarkappEmailSender) SendEmail(subject, content, tag string, to, cc, bcc []string, attachments []Attachment) error {
	if len(to) < 1 {
		return errors.New("receiver address is not specified")
	}

	e := postmarkEmail{
		From:        s.fromAddress,
		To:          strings.Join(to, ","),
		Cc:          strings.Join(cc, ","),
		Bcc:         strings.Join(bcc, ","),
		Subject:     subject,
		Tag:         tag,
		HtmlBody:    content,
		Attachments: attachmentToPostmarkapp(attachments),
	}

	data, err := json.Marshal(e)
	if err != nil {
		return err
	}

	fmt.Println(string(data))

	req, err := http.NewRequest(http.MethodPost, s.endpoint, bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Postmark-Server-Token", s.fromPassword)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var response postmarkResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		return err
	}

	if response.MessageID == "" {
		return fmt.Errorf("failed to send email: %w", string(body))
	}

	log.Printf("`%s` email was sent. Id: %s", tag, response.MessageID)

	return nil
}

func attachmentToPostmarkapp(attachments []Attachment) []postmarkAttachment {
	pa := make([]postmarkAttachment, len(attachments))
	for i, a := range attachments {
		pa[i] = postmarkAttachment{
			Name:        a.Name,
			ContentID:   a.ContentID,
			Content:     a.Content,
			ContentType: a.ContentType,
		}
	}

	return pa
}
