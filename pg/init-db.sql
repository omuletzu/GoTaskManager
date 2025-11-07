CREATE TYPE status_type AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status status_type NOT NULL DEFAULT 'TODO'
);