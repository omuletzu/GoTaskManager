export interface Task {
    id: string;
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE"
}

export type TaskAndTypename = Task & { __typename: "Task" };