package validator

import (
	"errors"
	"fmt"
	"regexp"
)

var (
	isValidAddress  = regexp.MustCompile("^0x[0-9a-fA-F]{40}$").MatchString
	isValidUsername = regexp.MustCompile("^[a-z0-9_]+$").MatchString
	isValidIPFS     = regexp.MustCompile("^ipfs://[0-9a-zA-Z]+$").MatchString
	isValidEmail    = regexp.MustCompile(`^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$`).MatchString
	isValidUrl      = regexp.MustCompile(`^(https?://)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$`).MatchString
)

func ValidateAddress(address *string) error {
	if err := ValidateRequiredString(address, "address"); err != nil {
		return err
	}

	if !isValidAddress(*address) {
		return errors.New("wrong address format")
	}

	return nil
}

func ValidateUsername(username *string) error {
	if err := ValidateRequiredString(username, "username"); err != nil {
		return err
	}

	if err := ValidateLength(*username, 3, 32, "username"); err != nil {
		return err
	}

	if !isValidUsername(*username) {
		return errors.New("wrong username format")
	}

	if (*username)[0] == '0' && (*username)[1] == 'x' {
		return errors.New("username has address format")
	}

	if *username == "validate" {
		return errors.New("wrong username")
	}

	return nil
}

func ValidateRequiredString(s *string, field string) error {
	if s == nil || *s == "" {
		return fmt.Errorf("%s is required and should not be empty", field)
	}
	return nil
}

func ValidateLength(s string, min, max int, field string) error {
	if len(s) < min {
		return fmt.Errorf("%s's min length is %d characters", field, min)
	}

	if len(s) > max {
		return fmt.Errorf("%s's max length is %d characters", field, max)
	}
	return nil
}

func ValidateIPFSUrl(url string, field string) error {
	if !isValidIPFS(url) {
		return fmt.Errorf("%s has not valid ipfs url", field)
	}

	return nil
}

func ValidateEmail(email string) error {
	if !isValidEmail(email) {
		return fmt.Errorf("email is not valid")
	}
	return nil
}

func ValidateUrl(url string, field string) error {
	if !isValidUrl(url) {
		return fmt.Errorf("%s is not valid url", field)
	}
	return nil
}
