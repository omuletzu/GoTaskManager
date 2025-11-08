import { gql } from "@apollo/client";

export const GET_TASKS = gql`
    query Tasks($status: Status) {
        tasks(status: $status) {
            id
            title
            description
            status
        }
    }
`

export const CREATE_TASK = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            id
            title
            description
            status
        }
    }
`

export const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
        updateTask(id: $id, input: $input) {
            id
            title
            description
            status
        }
    }
`

export const UPDATE_TASK_STATUS = gql`
    mutation UpdateTaskStatus($id: ID!, $input: UpdateTaskStatusInput!) {
        updateTaskStatus(id: $id, input: $input) {
            id
            title
            description
            status
        }
    }
`

export const DELETE_TASK = gql`
    query DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            id
            title
            description
            status
        }
    }
`
