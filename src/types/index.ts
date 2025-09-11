export type TabType = "dashboard" | "calendar" | "todolist" | "users";
export type UserRole = "normaluser" | "superuser";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  updatedAt: string;
  photo: string;
  authProvider: string;
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
}
