import { CreateTaskInput } from "./CreateTaskInput";
import { Task, TaskAndTypename } from "./Task";

export interface CreateTaskDataResponse {
  createTask: TaskAndTypename
}

export interface CreateTaskDataVars {
  input: CreateTaskInput;
}
