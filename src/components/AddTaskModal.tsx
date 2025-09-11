"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RightModal from "./RightModal";
import { Task } from "@/types";
import { getFormattedDate, getTaskStatus, getTimestamp } from "@/utils";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask?: (task: Task) => void;
  taskToEdit?: Task | null;
  onEditTask?: (task: Task) => void;
}

const emptyTask: Task = {
  userId: "",
  _id: "",
  title: "",
  description: "",
  dueDate: 0,
  dueTime: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  taskToEdit,
  onEditTask,
}: AddTaskModalProps) {
  const [isTask, setIsTask] = useState<Task>(taskToEdit ?? emptyTask);
  const [dateValue, setDateValue] = useState("");

  const handleSubmit = () => {
    try {
      if (
        !isTask.title ||
        !isTask.description ||
        !isTask.dueDate ||
        !isTask.dueTime
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      if (
        isTask.title &&
        isTask.description &&
        isTask.dueDate &&
        isTask.dueTime
      ) {
        const isValidSelectedDateTime = getTaskStatus(
          isTask.dueDate,
          isTask.dueTime
        );

        if (isValidSelectedDateTime === "Completed") {
          alert("Due date & time must be in the future.");
          return;
        }

        if (taskToEdit) {
          onEditTask?.(isTask);
        } else {
          onAddTask?.(isTask);
        }
        resetForm();
        onClose();
      }
    } catch (err) {
      console.error("Error in task submission:", err);
      alert("An error occurred. Please try again.");
      return;
    }
  };

  const resetForm = () => {
    setIsTask(emptyTask);
    setDateValue("");
  };

  useEffect(() => {
    if (taskToEdit) {
      setDateValue(getFormattedDate(taskToEdit.dueDate, true));
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  useEffect(() => {
    if (dateValue) {
      setIsTask((prev) => ({
        ...prev,
        dueDate: getTimestamp(dateValue),
      }));
    }
  }, [dateValue]);

  useEffect(() => {
    setIsTask(taskToEdit ?? emptyTask);
  }, [taskToEdit]);

  return (
    <RightModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title={taskToEdit ? "Edit Task" : "Add Task"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            value={isTask?.title}
            onChange={(e) =>
              setIsTask((prev: Task) => ({ ...prev, title: e.target.value }))
            }
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter Description"
            value={isTask?.description}
            onChange={(e) =>
              setIsTask((prev: Task) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full text-black resize-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ">
            Due Date<span className="text-red-500 ">*</span>
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={isTask?.dueTime}
            onChange={(e) =>
              setIsTask((prev: Task) => ({ ...prev, dueTime: e.target.value }))
            }
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors cursor-pointer">
            <Plus size={16} />
            <span>{taskToEdit ? "Update Task" : "Create Task"}</span>
          </button>
        </div>
      </div>
    </RightModal>
  );
}
