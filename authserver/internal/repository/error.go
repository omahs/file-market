package repository

var ErrNoRows = Error{"not found"}

type Error struct {
	Message string
}

func (e Error) Error() string {
	return e.Message
}
