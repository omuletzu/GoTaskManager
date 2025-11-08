package domain

type TaskRepository interface {
	GetTasks(status *Status) ([]*Task, error)
	CreateTask(task *Task) (*Task, error)
	UpdateTask(task *Task) (*Task, error)
	DeleteTask(id string) (*Task, error)
}
