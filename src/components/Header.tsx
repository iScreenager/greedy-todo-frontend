"use client";

import { useTaskCount } from "@/contexts/TaskCountContext";
import { User } from "@/types";
import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface HeaderProps {
  onNotificationClick: () => void;
  onProfileClick: () => void;
  user: User | null;
}

export default function Header({
  onNotificationClick,
  onProfileClick,
  user,
}: HeaderProps) {
  const pathName = usePathname();
  const { setSearchedText, searchedText } = useTaskCount();

  useEffect(() => {
    setSearchedText("");
  }, [pathName, setSearchedText]);

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative bg-gray-100 rounded-lg w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              value={searchedText}
              onChange={(e) => setSearchedText(e.target.value.trim())}
              placeholder="Search tasks..."
              className="pl-10 pr-4 text-gray-700 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onNotificationClick}
            className="relative flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
            <Bell size={24} color="black" />
            <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-0.5 right-0.5"></div>
          </button>
          <button
            onClick={onProfileClick}
            className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer">
            <span className="text-gray-600 font-medium">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "N"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
