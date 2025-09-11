"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileModal from "@/components/ProfileModal";
import NotificationModal from "@/components/NotificationModal";
import { TabType, User } from "@/types";

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
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      router.push("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      {/* Sidebar */}
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
      />
    </div>
  );
}
