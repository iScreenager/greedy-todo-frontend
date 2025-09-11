"use client";

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
  const [totalCount, setTotalCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [searchedText, setSearchedText] = useState("");

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
      }}>
      {children}
    </TaskCountContext.Provider>
  );
};
