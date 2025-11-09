import { Status } from "./Status";

export interface UpdateTaskStatusInput {
    id: string,
    status: Status
}