package main

import (
	"log"
	"net/http"
	"os"
	pg "taskmanager/db"
	"taskmanager/graph"
	pg_infrastruct "taskmanager/infrastruct/pg"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
)

const defaultPort = "8080"

func initDB() *pg_infrastruct.PgTaskRepository {
	pgUrl := os.Getenv("PG_URL")

	pgDb, err := pg.GetPgDb(pgUrl)

	if err != nil {
		log.Fatalf("Failed to connect to PG DB: %v", err)
	}

	return &pg_infrastruct.PgTaskRepository{DB: pgDb}
}

func initResolver() *graph.Resolver {
	repo := initDB()

	return &graph.Resolver{DBRepo: repo}
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Failed to load env")
		return
	}

	resolver := initResolver()

	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(
		graph.NewExecutableSchema(graph.Config{Resolvers: resolver}),
	)

	http.Handle("/", playground.Handler("GraphQL", "/graphql"))
	http.Handle("/graphql", srv)

	log.Printf("Server running on http://localhost:%s/", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
