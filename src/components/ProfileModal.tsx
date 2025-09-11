"use client";

import { LogOut } from "lucide-react";
import RightModal from "./RightModal";
import { User } from "@/types";
import { getFormattedDate } from "@/utils";
import { useTaskCount } from "@/contexts/TaskCountContext";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: User;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onLogout,
  user,
}: ProfileModalProps) {
  const { totalCount, upcomingCount, completedCount } = useTaskCount();
  const { patch } = useApi();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleUpdateProfile = async () => {
    try {
 
      const updatedUserProfile = await patch<{ user: User; token: string }>(
        "/user",
        {
          name,
          email,
        }
      );

      if (updatedUserProfile?.user && updatedUserProfile?.token) {
        localStorage.setItem("token", updatedUserProfile.token);
        localStorage.setItem("user", JSON.stringify(updatedUserProfile.user));
      }
    } catch (err) {
      console.error("Failed to update user profile:", err);
    }
  };

  return (
    <RightModal isOpen={isOpen} onClose={onClose} title="Profile">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
            <span className="text-gray-600 font-bold text-xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div>
            {user.role === "superuser" && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                Super Admin
              </span>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Joined On: {getFormattedDate(user.createdAt, false, true)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full px-3 py-2 text-gray-500  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            className="w-full py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium cursor-pointer "
            onClick={handleUpdateProfile}>
            Update Profile
          </button>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">All Todos</p>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-800">
                {upcomingCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedCount}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 text-black  hover:font-bold transition-colors cursor-pointer">
            <LogOut size={16} color="gray" className="hover:font-bold" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </RightModal>
  );
}
