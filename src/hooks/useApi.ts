import { useState } from "react";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const request = async <T, B = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: B
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      if (method === "DELETE") return null;

      const data: T = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const get = <T>(endpoint: string) => request<T>(endpoint, "GET");
  const post = <T, B = unknown>(endpoint: string, body: B) =>
    request<T>(endpoint, "POST", body);
  const put = <T, B = unknown>(endpoint: string, body: B) =>
    request<T>(endpoint, "PUT", body);
  const patch = <T, B = unknown>(endpoint: string, body?: B) =>
    request<T>(endpoint, "PATCH", body);
  const remove = (endpoint: string) => request(endpoint, "DELETE");

  return { get, post, put, patch, remove, loading, error };
}
