"use client";

import { Task } from "@/types";
import RightModal from "./RightModal";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Task[];
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
}: NotificationModalProps) {
  return (
    <RightModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      width="w-80">
      {!notifications ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4 h-80vh overflow-y-auto">
          {notifications.map((task,index) => (
            <div
              key={`${task._id}-${index}`}
              className="p-4 bg-blue-50  border border-blue-200 rounded-lg">
              <h4
                className={`font-medium ${task?.status === "expired" ? "text-yellow-900" : "text-blue-900"} `}>
                {task.title}
              </h4>
              <p
                className={`text-sm  mt-1 ${task?.status === "expired" ? "text-yellow-700" : "text-blue-700"}`}>
                {task.description}
              </p>
              <span
                className={`${task?.status === "expired" ? "text-yellow-600" : "text-blue-600"} text-xs`}>
                {task?.status === "expired" ? "Expired at: " : "Due at: "}
                {task.dueTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </RightModal>
  );
}
