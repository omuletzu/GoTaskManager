package pg

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

func connectPg() (*pgx.Conn, error) {
	url := os.Getenv("PG_URL")

	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		return nil, err
	}
	return conn, nil
}
