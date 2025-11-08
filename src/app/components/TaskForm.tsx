import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { CREATE_TASK } from "../utils/TaskOps";
import { CreateTaskInput } from "../models/CreateTaskInput";
import { gql } from "@apollo/client";
import {
  CreateTaskDataResponse,
  CreateTaskDataVars,
} from "../models/CreateTaskDataResponse";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTask] = useMutation<CreateTaskDataResponse, CreateTaskDataVars>(
    CREATE_TASK
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    const createTaskInput = {
      title: title,
      description: description,
    } as CreateTaskInput;

    await createTask({
      variables: {
        input: createTaskInput,
      },
      optimisticResponse: {
        __typename: "mutation",
        createTask: {
          __typename: "task",
          id: "temp-id-" + Math.random().toString(36).substr(2, 9),
          title: title,
          description: description,
          status: "TODO",
        },
      },
      update: (cache, { data }) => {
        if (!data || !data.createTask) return;

        const { createTask } = data;

        cache.modify({
          fields: {
            tasks(existingTasksRefs = []) {
              const newTaskRef = cache.writeFragment({
                data: createTask,
                fragment: gql`
                  fragment NewTask on Task {
                    id
                    title
                    description
                    status
                  }
                `,
              });

              return [...existingTasksRefs, newTaskRef];
            },
          },
        });
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <button type="submit">
            Add Task
        </button>
      </form>
    </div>
  );
}
