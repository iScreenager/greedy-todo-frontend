"use client";

import { useApi } from "@/hooks/useApi";
import { Task, User } from "@/types";
import React, { createContext, useContext, useState } from "react";

type TaskCountContextType = {
  totalCount: number;
  upcomingCount: number;
  completedCount: number;
  setTotalCount: (count: number) => void;
  setUpcomingCount: (count: number) => void;
  setCompletedCount: (count: number) => void;
  searchedText: string;
  setSearchedText: (v: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allTasks: Task[];
  setAllTasks: (tasks: Task[]) => void;
  getAllTasks: () => Promise<void>;
};

const TaskCountContext = createContext<TaskCountContextType | undefined>(
  undefined
);

export const useTaskCount = () => {
  const context = useContext(TaskCountContext);
  if (!context) {
    throw new Error("useTaskCount must be used within a TaskCountProvider");
  }
  return context;
};

export const TaskCountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { get } = useApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [searchedText, setSearchedText] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const getAllTasks = async () => {
    const data = await get<Task[]>("/task");
    if (data) {
      setAllTasks(data);
    }
  };

  return (
    <TaskCountContext.Provider
      value={{
        totalCount,
        upcomingCount,
        completedCount,
        setTotalCount,
        setUpcomingCount,
        setCompletedCount,
        searchedText,
        setSearchedText,
        currentUser,
        setCurrentUser,
        allTasks,
        setAllTasks,
        getAllTasks,
      }}>
      {children}
    </TaskCountContext.Provider>
  );
};
