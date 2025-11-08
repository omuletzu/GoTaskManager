import { CreateTaskInput } from "./CreateTaskInput";
import { Task } from "./Task";

export interface CreateTaskDataResponse {
    __typename: "mutation",
  createTask: Task & {
    __typename: "task";
  };
}

export interface CreateTaskDataVars {
  input: CreateTaskInput;
}
