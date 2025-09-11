"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpDown, Edit2, Plus, Trash2 } from "lucide-react";

import AddTaskModal from "@/components/AddTaskModal";
import TaskDetailsModal from "@/components/TaskDetailModal";
import { Loading } from "@/components/Loading";
import { useTaskCount } from "@/contexts/TaskCountContext";
import { Task } from "@/types";
import {
  convertTo24Hour,
  getFormattedDate,
  getStatusColor,
  getTaskStatus,
} from "@/utils";
import { useApi } from "@/hooks/useApi";

export default function Dashboard() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastLoginTime, setLastLogin] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterTasks, setFilterTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "status" | "dueDate";
    order: "asc" | "desc";
  } | null>(null);

  const {
    setTotalCount,
    setUpcomingCount,
    setCompletedCount,
    totalCount,
    upcomingCount,
    completedCount,
    searchedText,
  } = useTaskCount();
  const { get, post, put, remove, loading } = useApi();

  const handleAddTask = async (task: Task) => {
    const result = await post("/task", task);
    if (result) getAllTasks();
  };

  const handleEditTask = async (updatedTask: Task) => {
    const result = await put(`/task/${updatedTask._id}`, updatedTask);
    if (result) getAllTasks();
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await remove(`/task/${taskId}`);
    getAllTasks();
    setSelectedTask(null);
  };

  const handleSort = (key: "status" | "dueDate") => {
    let order: "asc" | "desc" = "asc";

    if (sortConfig?.key === key && sortConfig.order === "asc") order = "desc";

    const sorted = [...tasks].sort((a, b) => {
      if (key === "status") {
        const statusA = getTaskStatus(a.dueDate, a.dueTime);
        const statusB = getTaskStatus(b.dueDate, b.dueTime);
        if (statusA === statusB) return 0;
        return order === "asc"
          ? statusA === "Upcoming"
            ? -1
            : 1
          : statusA === "Upcoming"
            ? 1
            : -1;
      }
      if (key === "dueDate") {
        return order === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return 0;
    });

    setFilterTasks(sorted);
    setSortConfig({ key, order });
  };

  useEffect(() => {
    if (searchedText === "") return setFilterTasks(tasks);

    const lower = searchedText.trim().toLowerCase();
    setFilterTasks(
      tasks.filter((task) => task.title.toLowerCase().includes(lower))
    );
  }, [searchedText, tasks]);

  useEffect(() => {
    const upcoming = tasks.filter(
      (task) => getTaskStatus(task.dueDate, task.dueTime) === "Upcoming"
    ).length;
    const completed = tasks.filter(
      (task) => getTaskStatus(task.dueDate, task.dueTime) === "Completed"
    ).length;
    setTotalCount(tasks.length);
    setUpcomingCount(upcoming);
    setCompletedCount(completed);
  }, [tasks, setTotalCount, setUpcomingCount, setCompletedCount]);

  const getUserDetail = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setFirstName(user.name.split(" ")[0]);
      setLastLogin(user.lastLoginTime);
    }
  };

  const getAllTasks = async () => {
    const data = await get<Task[]>("/task");
    if (data) {
      setTasks(data);
      setFilterTasks(data);
    }
  };

  useEffect(() => {
    getUserDetail();
    getAllTasks();
  }, []);

  const handleEditTaskDetailsModal = (task: Task) => {
    setSelectedTask(null);
    setTaskToEdit(task);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen overflow-hidden p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8">
        <h1 className="text-base md:text-lg lg:text-3xl font-semibold text-gray-800">
          Hello, {firstName}
        </h1>
        <p className="text-gray-600 text-xs md:text-sm lg:text-lg mt-1 md:mt-0">
          Last Login time: {getFormattedDate(lastLoginTime)}
        </p>
      </div>

      <div className="grid grid-cols-3 bg-white rounded-lg overflow-hidden mb-4 md:mb-8 divide-x divide-gray-200 text-center">
        <div className="p-2 md:p-6">
          <h3 className="text-gray-600 font-semibold text-xs md:text-sm mb-1">
            All Tasks
          </h3>
          <p className="text-sm md:text-2xl lg:text-4xl font-bold text-gray-800">
            {totalCount}
          </p>
        </div>
        <div className="p-2 md:p-6">
          <h3 className="text-gray-600 font-semibold text-xs md:text-sm mb-1">
            Upcoming
          </h3>
          <p className="text-sm md:text-2xl lg:text-4xl font-bold text-gray-800">
            {upcomingCount}
          </p>
        </div>
        <div className="p-2 md:p-6">
          <h3 className="text-gray-600 font-semibold text-xs md:text-sm mb-1">
            Completed
          </h3>
          <p className="text-sm md:text-2xl lg:text-4xl font-bold text-gray-800">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="h-[55vh] bg-white rounded-lg shadow-sm border flex flex-col">
        <div className="p-4 md:p-6 border-b flex justify-between items-center">
          <h2 className="text-sm md:text-xl font-semibold text-gray-600">
            All Tasks
          </h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-base">
            <Plus className="w-3 h-3 md:w-4.5 md:h-4.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-h-[45vh] overflow-y-auto">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs md:text-sm font-bold text-gray-600 w-2/5">
                    Task
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-600 cursor-pointer hidden lg:table-cell w-1/5"
                    onClick={() => handleSort("dueDate")}>
                    <div className="flex items-center gap-1 font-bold">
                      Due Date
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-600 cursor-pointer hidden md:table-cell w-1/5"
                    onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1 font-bold">
                      Status
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-4 py-2 text-right md:text-left text-xs md:text-sm font-bold text-gray-600 w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filterTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-sm text-gray-500">
                      No Task Found
                    </td>
                  </tr>
                ) : (
                  filterTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTask(task)}>
                      <td className="px-4 py-4 w-2/5">
                        <p className="font-semibold text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 truncate max-w-xs hidden lg:table-cell">
                          {task.description}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-900 hidden lg:table-cell w-1/5">
                        {getFormattedDate(task.dueDate)}
                        <br />
                        <span className="text-gray-600">
                          {convertTo24Hour(task.dueTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell w-1/5">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            getTaskStatus(task.dueDate, task.dueTime)
                          )}`}>
                          {getTaskStatus(task.dueDate, task.dueTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 flex justify-end md:justify-start space-x-2  md:w-1/5">
                        <button
                          onClick={(e) => {
                            setTaskToEdit(task);
                            e.stopPropagation();
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            handleDeleteTask(task._id);
                            e.stopPropagation();
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddTask || !!taskToEdit}
        onClose={() => {
          setShowAddTask(false);
          setTaskToEdit(null);
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        taskToEdit={taskToEdit}
      />

      <TaskDetailsModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        selectedTask={selectedTask}
        onEdit={handleEditTaskDetailsModal}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
