"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import { User, UserRole } from "@/types";
import { useTaskCount } from "@/contexts/TaskCountContext";
import { Loading } from "@/components/Loading";
import { useApi } from "@/hooks/useApi";
import socket from "@/lib/socket";

const rolePriority: Record<UserRole, number> = {
  superuser: 1,
  normaluser: 2,
};

export default function UsersPage() {
  const { searchedText } = useTaskCount();
  const { get, patch } = useApi();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const handleToggleUserStatus = async (
    e: React.ChangeEvent<HTMLInputElement>,
    user: User
  ) => {
    e.preventDefault();
    if (user.id === localUser?.id) return;

    try {
      await patch<User>(`/user/${user.id}`);
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleSortByRole = () => {
    if (!users) return;
    const sorted = [...users].sort((a, b) => {
      const diff = rolePriority[a.role] - rolePriority[b.role];
      return sortDirection === "asc" ? diff : -diff;
    });
    setFilteredUsers(sorted);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getAllUsers = useCallback(async () => {
    setPageLoading(true);
    try {
      const data = await get<User[]>("/user");
      if (data) {
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch all users:", err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setLocalUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to parse local user:", err);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    socket.on("userRoleUpdated", (data: User) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === data?.id ? { ...u, role: data?.role } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u.id === data?.id ? { ...u, role: data?.role } : u))
      );
    });

    return () => {
      socket.off("userRoleUpdated");
    };
  }, []);

  useEffect(() => {
    if (!searchedText.trim()) return setFilteredUsers(users);

    const lower = searchedText.trim().toLowerCase();
    setFilteredUsers(
      users.filter((user) => user.name.toLowerCase().includes(lower))
    );
  }, [searchedText, users]);

  if (pageLoading) return <Loading />;

  return (
    <div className="overflow-y-auto max-h-[90vh] mt-5">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-50 hidden md:table-header-group">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={handleSortByRole}>
              <div className="flex items-center gap-1">
                Role <ArrowUpDown size={12} />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-sm text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user, index) => (
              <tr
                key={`${user.id}-${index}`}
                className="hover:bg-gray-50 transition-colors block md:table-row p-4 md:p-0 border md:border-0 rounded-lg md:rounded-none mb-3 md:mb-0 shadow-sm md:shadow-none">
                <td className="px-6 py-2 md:py-4 flex items-center gap-3 md:table-cell">
                  <span className="md:hidden font-semibold text-gray-500">
                    Name:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                </td>
                <td className="px-6 py-2 md:py-4 flex items-center gap-3 md:table-cell text-sm text-gray-900">
                  <span className="md:hidden font-semibold text-gray-500">
                    Email:
                  </span>
                  {user.email}
                </td>
                <td className="px-6 py-2 md:py-4 flex items-center gap-3 md:table-cell text-sm text-gray-900">
                  <span className="md:hidden font-semibold text-gray-500">
                    Role:
                  </span>
                  {user.role}
                </td>
                <td className="px-6 py-2 md:py-4 flex items-center gap-3 md:table-cell">
                  <span className="md:hidden font-semibold text-gray-500">
                    Actions:
                  </span>
                  <label
                    className={`relative inline-flex items-center ${
                      user.id === localUser?.id
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.role === "superuser"}
                      disabled={user.id === localUser?.id}
                      onChange={(e) => handleToggleUserStatus(e, user)}
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300
                        peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:after:translate-x-full peer-checked:after:border-white
                        ${user.id === localUser?.id ? "opacity-50" : ""}`}></div>
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
