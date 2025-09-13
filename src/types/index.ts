export type TabType = "dashboard" | "calendar" | "todolist" | "users";
export type UserRole = "normaluser" | "superuser";
export type AuthProvider = "local" | "google" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  lastLoginTime: number;
  updatedAt: string;
  photo: string;
  authProvider: AuthProvider;
}

export interface Task {
  userId: string;
  _id: string;
  title: string;
  description: string;
  dueDate: number;
  dueTime: string;
  createdAt: number;
  updatedAt: number;
  status?: "expired" | "4hr";
}