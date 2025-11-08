import { useMutation, useQuery } from "@apollo/client/react";
import { GET_TASKS } from "../utils/TaskOps";
import { Status } from "../models/Status";
import { GetTasksDataInterface } from "../models/GetTasksDataResponse";
import TaskItem from "../components/TaskItem";

export default function TaskList() {
  const { data, loading, error, refetch } =
    useQuery<GetTasksDataInterface>(GET_TASKS);

  return (
    <div>
      {loading && <h3>Loading...</h3>}

      {error && <h3>Error {error.message}</h3>}

      {data &&
        Object.values(Status).map((statusCategory) => (
          <div key={statusCategory}>
            <h2>{statusCategory}</h2>
            {data.tasks
              .filter((task) => task.status === statusCategory)
              .map((task) => (
                <TaskItem key={task.id} task={task} refetchTask={refetch} />
              ))}
          </div>
        ))}
    </div>
  );
}
