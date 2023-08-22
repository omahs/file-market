package validator

import (
	"encoding/json"
	"net/http"
	"strings"
)

type CompositedError struct {
	Errors  []error
	code    int32
	message string
}

func (c *CompositedError) Code() int32 {
	return c.code
}

func (c *CompositedError) Error() string {
	if len(c.Errors) > 0 {
		msgs := []string{c.message + ":"}
		for _, e := range c.Errors {
			msgs = append(msgs, e.Error())
		}
		return strings.Join(msgs, "\n")
	}
	return c.message
}

func (c *CompositedError) MarshalJSON() ([]byte, error) {
	return json.Marshal(map[string]interface{}{
		"code":    c.code,
		"message": c.message,
		"errors":  c.Errors,
	})
}

func CompositeError(errors ...error) *CompositedError {
	return &CompositedError{
		code:    http.StatusUnprocessableEntity,
		Errors:  append([]error{}, errors...),
		message: "validation failure list",
	}
}
