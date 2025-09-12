"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileModal from "@/components/ProfileModal";
import NotificationModal from "@/components/NotificationModal";
import { TabType, Task, User } from "@/types";
import socket from "@/lib/socket";
import { ToastNotification } from "@/components/ToastNotification";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState<TabType>(
    (pathName?.slice(1) as TabType) || "dashboard"
  );
  const [userData, setUserData] = useState<User | null>(null);
  const [uiState, setUiState] = useState({
    sidebarOpen: false,
    showNotifications: false,
    showProfile: false,
  });
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [toast, setToast] = useState<Task[] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const user: User = JSON.parse(storedUser);
      setUserData(user);

      if (!socket.connected) socket.connect();

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const currentUser: User = JSON.parse(storedUser);

    socket.on("userRoleUpdated", (updatedUser: User) => {
      if (updatedUser?.id === currentUser.id) {
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (pathName === "/users" && updatedUser.role !== "superuser") {
          router.replace("/dashboard");
          setActiveTab("dashboard");
        }
      }
    });

    return () => {
      socket.off("userRoleUpdated");
    };
  }, [userData, router, pathName]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const currentUser: User = JSON.parse(storedUser);

    socket.on("getNotification", (tasks: Task[]) => {
      const newTasks = tasks.filter(
        (task) => !notifications.some((n) => n._id === task._id)
      );
      if (newTasks.length > 0) {
        setToast(newTasks);
      }
      setNotifications(tasks);
    });

    socket.emit("requestForNotification", currentUser.id);

    const interval = setInterval(
      () => {
        socket.emit("requestForNotification", currentUser.id);
      },
      10 * 60 * 1000
    );

    return () => {
      socket.off("getNotification");
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.disconnect();
    router.push("/auth/login");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={uiState.sidebarOpen}
        setSidebarOpen={(open) =>
          setUiState((prev) => ({ ...prev, sidebarOpen: open }))
        }
        userRole={userData?.role ?? "normaluser"}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          uiState.sidebarOpen ? "ml-64" : "ml-16"
        }`}>
        <Header
          user={userData}
          onNotificationClick={() =>
            setUiState((prev) => ({ ...prev, showNotifications: true }))
          }
          onProfileClick={() =>
            setUiState((prev) => ({ ...prev, showProfile: true }))
          }
        />

        <main>{children}</main>
      </div>

      {userData && (
        <ProfileModal
          isOpen={uiState.showProfile}
          onClose={() =>
            setUiState((prev) => ({ ...prev, showProfile: false }))
          }
          onLogout={handleLogout}
          user={userData}
        />
      )}

      <NotificationModal
        isOpen={uiState.showNotifications}
        onClose={() =>
          setUiState((prev) => ({ ...prev, showNotifications: false }))
        }
        notifications={notifications}
      />

      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toast &&
          toast?.map((task) => (
            <ToastNotification
              key={`${task._id}-${Math.random()}`}
              task={task}
              onClose={() =>
                setToast((prev) =>
                  prev ? prev.filter((t) => t._id !== task._id) : null
                )
              }
            />
          ))}
      </div>
    </div>
  );
}
