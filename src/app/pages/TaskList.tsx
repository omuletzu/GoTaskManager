import { useMutation, useQuery } from "@apollo/client/react";
import { GET_TASKS } from "../utils/TaskOps";
import { Status } from "../models/Status";
import { GetTasksDataInterface } from "../models/GetTasksDataResponse";
import TaskItem from "../components/TaskItem";
import { useState } from "react";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import TaskForm from "../components/TaskForm";
import { GetTasksDataInput } from "../models/GetTasksDataInput";

export default function TaskList() {
  const [currentStatus, setCurrentStatus] = useState<Status>(Status.TODO);

  const { data, loading, error, refetch } = useQuery<
    GetTasksDataInterface,
    GetTasksDataInput
  >(GET_TASKS, {
    variables: {
      status: currentStatus,
    } as GetTasksDataInput,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");

  return (
    <div>
      {loading && <h3>Loading...</h3>}

      {error && <h3>Error {error.message}</h3>}

      {modalError && <h3>Error {modalError}</h3>}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded m-6">
            New Task
          </button>
        </DialogTrigger>

        <DialogContent className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm" />

          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">
                Create a new task
              </DialogTitle>
            </DialogHeader>

            <TaskForm
              onClose={() => {
                setShowModal(false);
              }}
              onError={(err) => {
                setModalError(err);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="m-6">
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value as Status)}
        >
          {Object.values(Status).map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        {data && (
          <div key={currentStatus}>
            {data.tasks.map((task) => (
              <TaskItem key={task.id} task={task} refetchTask={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
