"use client";

import RightModal from "./RightModal";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
}: NotificationModalProps) {
 
  return (
    <RightModal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      width="w-80">
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">New Todo Assignment</h4>
          <p className="text-sm text-blue-700 mt-1">
            You have been assigned a new todo: Submit project report
          </p>
          <span className="text-xs text-blue-600">2 hours ago</span>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900">Deadline Reminder</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Todo Team stand-up meeting is due in 1 hour
          </p>
          <span className="text-xs text-yellow-600">1 hour ago</span>
        </div>

        
      </div>
    </RightModal>
  );
}
