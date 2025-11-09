# TaskManager

[![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098?logo=graphql&logoColor=white)](https://graphql.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Apollo Client](https://img.shields.io/badge/Apollo%20Client-Frontend-311C87?logo=apollographql)](https://www.apollographql.com/)

## Table of Contents

- [Overview](#overview)  
- [Demo](#demo)  
- [Features](#features)  
  - [Backend (Go, GraphQL, PostgreSQL)](#backend-go-graphql-postgresql)  
    - [Entities](#entities)  
    - [Queries](#queries)  
    - [Mutations](#mutations)  
    - [Database](#database)  
    - [Architecture](#architecture)  
  - [Frontend (Next.js, Apollo Client)](#frontend-nextjs-apollo-client)  
  - [DevOps](#devops)  
- [Backend Architecture](#backend-architecture)  
- [Environmental Configuration](#environmental-configuration)  
- [Deployment](#deployment)

## Overview

A project that allows users to *view, add, edit and delete* tasks with status filtering.

- **Backend:** Go + GraphQL + PostgreSQL  
- **Frontend:** Next.js + Apollo Client  
- **Containerization:** Docker & Docker Compose  
- **Architecture:** Hexagonal (Ports & Adapters) pattern

## Demo

https://github.com/user-attachments/assets/01c3bac5-a52b-4057-bd44-b728d8204d51

## Features

### Backend (Go, GraphQL, Postgresql)

- **Entities:**  
  - `Task`: `id`, `title`, `description`, `status (TODO | IN_PROGRESS | DONE)`
- **Queries:**
  - `tasks(status: Status)` → returns filtered list of tasks
- **Mutations:**
  - `createTask({ title, description })` → creates a new task  
  - `updateTaskStatus({ id, status })` → updates a task’s status
  - `updateTask({ id, title, description })` → updates a task’s data
  - `deleteTask({ id })` → deletes a task
- **Database:** PostgreSQL (table: `tasks`)
- **Architecture:** Organized following **Hexagonal Architecture**

### Frontend (Next.js, Apollo Client)

- Main page displaying the list of tasks
- Dropdown filter to view tasks by status
- Form to create a new task (default TODO status)
- Ability to **edit status** or **delete** a task
- Communication with backend via **GraphQL (Apollo Client)**
- Apollo Client was used for **query and mutation caching**, improving performance and providing a more responsive UI.

### DevOps

- **Fully containerized** setup using Docker
- **Orchestrated** via Docker Compose (`backend`, `frontend`, and `db` services)

## Backend Architecture

The projects follows the Hexagonal Architecture (Ports & Adapters) pattern:

- **Domain Layer**: Core business logic and interfaces (independent of frameworks)
- **Infrastructure Layer**: Concrete implementations for persistence (PostgreSQL) and GraphQL API
- **Adapters**: GraphQL resolvers act as entry points, delegating logic to the domain services

## Environmental Configuration

Before running the containers, you need to create a .env file in the project root (same level as docker-compose.yml).

`.env` file template:

```
# Frontend (Next.js)
NEXT_PUBLIC_GQL_URL=

# Backend (Go)
PORT=

# PostgreSQL
PG_URL=
```

## Deployment

To deploy the application using Docker, make sure all images are built and then start the containers with Docker Compose:

```
docker build -t task-be ./backend
```

```
docker build -t task-fe ./frontend
```

```
docker-compose up -d
```
