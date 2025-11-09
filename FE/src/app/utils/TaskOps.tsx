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
    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
            title
            description
            status
        }
    }
`

export const UPDATE_TASK_STATUS = gql`
    mutation UpdateTaskStatus($input: UpdateTaskStatusInput!) {
        updateTaskStatus(input: $input) {
            id
            title
            description
            status
        }
    }
`

export const DELETE_TASK = gql`
    mutation DeleteTask($input: DeleteTaskInput!) {
        deleteTask(input: $input) {
            id
            title
            description
            status
        }
    }
`
