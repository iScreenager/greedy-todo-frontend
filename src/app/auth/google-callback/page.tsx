"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      window.history.replaceState({}, document.title, "/dashboard");

      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
