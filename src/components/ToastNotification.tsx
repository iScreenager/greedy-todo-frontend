import { Task } from "@/types";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ToastProps {
  task?: Task;
  onClose?: () => void;
}

export const ToastNotification = ({ task, onClose }: ToastProps) => {
  const [timeCounter, setTimeCounter] = useState(5);

  useEffect(() => {
    if (timeCounter === 0) {
      onClose?.();
      return;
    }

    const timer = setInterval(() => setTimeCounter((prev) => prev - 1), 1500);
    return () => clearInterval(timer);
  }, [timeCounter, onClose]);

  return (
    <div
      className={`${task?.status === "4hr" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}  max-w-xs w-full p-4 rounded-lg flex items-start gap-3 shadow-sm border border-transparent transition-all duration-300 `}>
      <div className="flex-1">
        <p className="font-semibold text-sm">{task?.title}</p>
        <p className="text-xs text-gray-700 mt-1">
          {task?.status === "4hr"
            ? "Task is going to end in 4 hours."
            : "Task Completed."}
        </p>
      </div>

      <X
        onClick={onClose}
        className="cursor-pointer text-gray-500 hover:text-gray-800 "
        size={16}
      />
    </div>
  );
};
