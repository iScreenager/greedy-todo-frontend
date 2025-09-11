"use client";

import { Calendar, Edit3Icon, Flag, Trash2 } from "lucide-react";
import RightModal from "./RightModal";
import { Task } from "@/types";
import { convertTo24Hour, getFormattedDate, getStatusColor, getTaskStatus } from "@/utils";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTask: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  selectedTask,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  if (!selectedTask) return null;

  return (
    <RightModal isOpen={isOpen} onClose={onClose} title="Todo Details">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          {selectedTask.title}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 gap-6">
            <div className="flex gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-800">
                Due Date
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800">
              {getFormattedDate(selectedTask.dueDate)}
              {"  "}
              {convertTo24Hour(selectedTask.dueTime)}
            </p>
          </div>

          <div className="flex items-center space-x-3 gap-10">
            <div className="flex gap-2">
              <Flag size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-800">Status</span>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(getTaskStatus(selectedTask.dueDate, selectedTask.dueTime))}`}>
              {getTaskStatus(selectedTask.dueDate, selectedTask.dueTime)}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(selectedTask)}
              className="p-2 text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">
              <Edit3Icon size={16} />
            </button>
            <button
              onClick={() => onDelete(selectedTask._id)}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="w-full border" />
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-800">
                Description
              </span>
              <p className="mt-2 text-sm font-medium text-gray-800 ">
                {selectedTask.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RightModal>
  );
}
