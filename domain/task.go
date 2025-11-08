package domain

type Status string

const (
	Todo       Status = "TODO"
	InProgress Status = "IN_PROGRESS"
	Done       Status = "DONE"
)

type Task struct {
	ID          string
	Title       string
	Description *string
	Status      Status
}
