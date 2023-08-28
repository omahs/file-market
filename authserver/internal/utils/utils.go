package utils

import "math/rand"

const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890"

func RandomString(l int) string {
	res := make([]byte, l)
	for i := 0; i < l; i++ {
		res[i] = alphabet[rand.Intn(len(alphabet))]
	}

	return string(res)
}

func UnwrapString(str *string) string {
	if str == nil {
		return ""
	}
	return *str
}
