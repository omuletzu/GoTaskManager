import { useMutation } from "@apollo/client/react";
import { Task, TaskAndTypename } from "../models/Task";
import { DELETE_TASK, UPDATE_TASK_STATUS, GET_TASKS } from "../utils/TaskOps";
import { Status } from "../models/Status";
import { UpdateTaskStatusInput } from "../models/UpdateTaskStatusInput";
import { DeleteTaskInput } from "../models/DeleteTaskInput";

interface TaskItemProps {
  task: Task;
  refetchTask: () => void;
}

export default function TaskItem({ task, refetchTask }: TaskItemProps) {
  const [updateTaskStatus] = useMutation<
    { updateTaskStatus: TaskAndTypename },
    { input: UpdateTaskStatusInput }
  >(UPDATE_TASK_STATUS);

  const [deleteTask] = useMutation<
    { deleteTask: TaskAndTypename },
    { input: DeleteTaskInput }
  >(DELETE_TASK);

  const handleUpdateTaskStatus = async (updatedStatus: Status) => {
    const input: UpdateTaskStatusInput = { id: task.id, status: updatedStatus };

    await updateTaskStatus({
      variables: { input },
      optimisticResponse: {
        updateTaskStatus: {
          __typename: "Task",
          id: task.id,
          title: task.title,
          description: task.description,
          status: updatedStatus,
        } as TaskAndTypename,
      },
      update: (cache, { data }) => {
        if (!data?.updateTaskStatus) return;

        const updatedTask = data.updateTaskStatus;

        cache.updateQuery<{ tasks: Task[] }, { status?: Status }>(
          {
            query: GET_TASKS,
            variables: { status: task.status } as UpdateTaskStatusInput,
          },
          (oldData) => {
            if (!oldData) return { tasks: [] };
            return {
              tasks: oldData.tasks.filter((t) => t.id !== task.id),
            };
          }
        );

        cache.updateQuery<{ tasks: Task[] }, { status?: Status }>(
          {
            query: GET_TASKS,
            variables: { status: updatedTask.status } as UpdateTaskStatusInput,
          },
          (oldData) => {
            if (!oldData) return { tasks: [updatedTask] };
            return { tasks: [...oldData.tasks, updatedTask] };
          }
        );
      },
    });
  };

  const handleDeleteTask = async () => {
    const input: DeleteTaskInput = { id: task.id };

    await deleteTask({
      variables: { input },
      optimisticResponse: {
        deleteTask: {
          __typename: "Task",
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        } as TaskAndTypename,
      },
      update: (cache) => {
        cache.modify({
          fields: {
            tasks(existingTasksRefs = [], { readField }) {
              return existingTasksRefs.filter(
                (taskRef: any) => task.id !== readField("id", taskRef)
              );
            },
          },
        });
      },
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        {task.description && (
          <p className="mt-1 text-gray-600">{task.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={task.status}
          onChange={(e) => handleUpdateTaskStatus(e.target.value as Status)}
        >
          {Object.values(Status).map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          onClick={handleDeleteTask}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
