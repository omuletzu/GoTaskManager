import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { CREATE_TASK, GET_TASKS } from "../utils/TaskOps";
import { CreateTaskInput } from "../models/CreateTaskInput";
import { gql } from "@apollo/client";
import {
  CreateTaskDataResponse,
  CreateTaskDataVars,
} from "../models/CreateTaskDataResponse";
import { X } from "lucide-react";
import { GetTasksDataInput } from "../models/GetTasksDataInput";
import { Task } from "../models/Task";

interface FormProps {
  onError: (err: string) => void;
  onClose: () => void;
}

export default function TaskForm({ onError, onClose }: FormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTask, { loading }] = useMutation<
    CreateTaskDataResponse,
    CreateTaskDataVars
  >(CREATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    const createTaskInput = {
      title: title,
      description: description,
    } as CreateTaskInput;

    try {
      await createTask({
        variables: {
          input: createTaskInput,
        },
        optimisticResponse: {
          createTask: {
            __typename: "Task",
            id: "temp-id-" + Math.random().toString(36).substr(2, 9),
            title: title,
            description: description,
            status: "TODO",
          },
        },
        update: (cache, { data }) => {
          if (!data || !data.createTask) return;

          const { createTask } = data;

          cache.updateQuery<{ tasks: Task[] }, GetTasksDataInput>(
            {
              query: GET_TASKS,
              variables: {
                status: createTask.status,
              } as GetTasksDataInput,
            },
            (oldData) => {
              if (!oldData) return { tasks: [createTask] };

              return {
                tasks: [...oldData.tasks, createTask],
              };
            }
          );
        },
      });

      setTitle("");
      setDescription("");

      onClose();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div>
      <form
        className="flex flex-col space-y-4 m-12 p-6"
        onSubmit={handleSubmit}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <input
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Task Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <textarea
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Task Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        {loading && <>Loading...</>}

        {!loading && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            type="submit"
          >
            Add Task
          </button>
        )}
      </form>
    </div>
  );
}
