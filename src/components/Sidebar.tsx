"use client";

import { TabType, UserRole } from "@/types";
import {
  Users,
  ChevronsRight,
  ChevronsLeft,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (view: TabType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  userRole,
}: SidebarProps) {
  const isSuperUser = userRole === "superuser";

  const menuItems = isSuperUser
    ? [
        {
          id: "dashboard" as TabType,
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },

        {
          id: "users" as TabType,
          label: "Users",
          icon: Users,
          path: "/users",
        },
      ]
    : [
        {
          id: "dashboard" as TabType,
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },
        // { id: "calendar" as TabType, label: "Calendar", icon: CalendarDays },
        // { id: "todolist" as TabType, label: "To do list", icon: NotepadText },
      ];

  return (
    <div
      className={` ${isSuperUser ? "bg-gray-900 text-white" : "bg-white text-black"}  h-screen fixed left-0 top-0 z-30 px-4 pt-6 transition-transform duration-300  ${
        sidebarOpen ? "w-62" : "w-16"
      }`}>
      <div className="border-gray-700 flex justify-between">
        <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
          GREEDYGAME
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={` ${isSuperUser ? "p-1 bg-[#444B55] hover:bg-gray-700 rounded" : ""}  transition-colors  rounded-full cursor-pointer hidden md:block`}>
          {sidebarOpen ? (
            <ChevronsLeft size={20} />
          ) : (
            <ChevronsRight size={20} />
          )}
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path || "#"}
              onClick={() => setActiveTab(item.id)}
              className={`w-full  flex items-center space-x-5 px-2 py-1   rounded-lg transition-colors ${
                activeTab === item.id ? "bg-green-600" : "hover:bg-gray-700"
              }`}>
              <Icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
