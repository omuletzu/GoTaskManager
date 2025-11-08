package pg

import (
	"context"
	"database/sql"
	"strconv"
	"taskmanager/domain"
)

type PgTaskRepository struct {
	DB *sql.DB
}

type Scanner interface {
	Scan(x ...interface{}) error
}

func ScanRow(row Scanner) (*domain.Task, error) {
	var row_id int
	var row_title string
	var row_description sql.NullString
	var row_status string

	if err := row.Scan(&row_id, &row_title, &row_description, &row_status); err != nil {
		return nil, err
	}

	var description *string

	if row_description.Valid {
		description = &row_description.String
	}

	return &domain.Task{
		ID:          strconv.Itoa(row_id),
		Title:       row_title,
		Description: description,
		Status:      domain.Status(row_status),
	}, nil
}

func (r *PgTaskRepository) GetTask(status *domain.Status) ([]*domain.Task, error) {
	ctx := context.Background()

	query := "SELECT id, title, description, status FROM query"

	var sql_args []interface{}

	if status != nil {
		query += " WHERE status = $1"
		sql_args = append(sql_args, status)
	}

	rows, err := r.DB.QueryContext(ctx, query, sql_args...)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var tasks []*domain.Task

	for rows.Next() {
		x, err := ScanRow(rows)

		if err != nil {
			return nil, err
		}

		tasks = append(tasks, x)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *PgTaskRepository) CreateTask(task *domain.Task) (*domain.Task, error) {
	ctx := context.Background()

	query := "INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING id, title, description, status"

	var sql_description sql.NullString

	if task.Description != nil {
		sql_description = sql.NullString{
			String: *task.Description,
			Valid:  true,
		}
	} else {
		sql_description = sql.NullString{Valid: false}
	}

	row := r.DB.QueryRowContext(ctx, query, task.Title, sql_description, task.Status)

	inserted_row, err := ScanRow(row)

	if err != nil {
		return nil, err
	}

	return inserted_row, nil
}

func (r *PgTaskRepository) UpdateTask(task *domain.Task) (*domain.Task, error) {
	ctx := context.Background()

	sql_id, err := strconv.Atoi(task.ID)

	if err != nil {
		return nil, err
	}

	query := "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING id, title, description, status"

	var sql_description sql.NullString

	if task.Description != nil {
		sql_description = sql.NullString{
			String: *task.Description,
			Valid:  true,
		}
	} else {
		sql_description = sql.NullString{Valid: false}
	}

	row := r.DB.QueryRowContext(ctx, query, task.Title, sql_description, task.Status, sql_id)

	updated_row, err := ScanRow(row)

	if err != nil {
		return nil, err
	}

	return updated_row, nil
}

func (r *PgTaskRepository) DeleteTask(id string) (*domain.Task, error) {
	ctx := context.Background()

	sql_id, err := strconv.Atoi(id)

	if err != nil {
		return nil, err
	}

	query := "DELETE FROM tasks WHERE id = $1 RETURNING id, title, description, status"

	row := r.DB.QueryRowContext(ctx, query, sql_id)

	deleted_row, err := ScanRow(row)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return deleted_row, nil
}
