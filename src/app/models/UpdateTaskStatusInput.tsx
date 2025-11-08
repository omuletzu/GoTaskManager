import { Status } from "./Status";

export interface UpdateTaskStatusInput {
    ID: string,
    status: Status
}