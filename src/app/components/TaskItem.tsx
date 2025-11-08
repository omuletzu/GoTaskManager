import { useMutation } from "@apollo/client/react";
import { Task } from "../models/Task";
import { DELETE_TASK, UPDATE_TASK_STATUS } from "../utils/TaskOps";
import { Status } from "../models/Status";
import { UpdateTaskStatusInput } from "../models/UpdateTaskStatusInput";
import { DeleteTaskInput } from "../models/DeleteTaskInput";

interface TaskItemProps {
  task: Task;
  refetchTask: () => void;
}

export default function TaskItem({ task, refetchTask }: TaskItemProps) {
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleUpdateTaskStatus = async (updatedStatus: Status) => {
    const updateStatusInput = {
      ID: task.id,
      status: updatedStatus,
    } as UpdateTaskStatusInput;

    await updateTaskStatus({
      variables: {
        input: updateStatusInput,
      },
      optimisticResponse: {
        __typename: "mutation",
        updateTaskStatus: {
          __typename: "task",
          id: task.id,
          title: task.title,
          description: task.description,
          status: updatedStatus,
        },
      },
    });
  };

  const handleDeleteTask = async () => {
    const deleteTaskInput = {
      ID: task.id,
    } as DeleteTaskInput;

    await deleteTask({
      variables: {
        input: deleteTaskInput,
      },
      optimisticResponse: {
        __typename: "mutation",
        updateTaskStatus: {
          __typename: "task",
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        },
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
    <div>
      <div>
        <h3>{task.title}</h3>
        {task.description && <h3>{task.description}</h3>}
      </div>

      <select
        value={task.status}
        onChange={(e) => handleUpdateTaskStatus(e.target.value as Status)}
      >
        {Object.values(Status).map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      <button onClick={handleDeleteTask}>Delete</button>
    </div>
  );
}
