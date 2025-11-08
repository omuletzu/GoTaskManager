package graph

import (
	"taskmanager/domain"
	"taskmanager/graph/model"
)

func ToGraphQL(task *domain.Task) *model.Task {
	return &model.Task{
		ID:          task.ID,
		Title:       task.Title,
		Description: task.Description,
		Status:      model.Status(task.Status),
	}
}

func ToArrGraphQL(tasks []*domain.Task) []*model.Task {
	arr := make([]*model.Task, len(tasks))

	for i, task := range tasks {
		arr[i] = ToGraphQL(task)
	}

	return arr
}
