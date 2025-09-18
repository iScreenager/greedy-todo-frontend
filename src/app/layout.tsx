import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TaskCountProvider } from "@/contexts/TaskCountContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greedy-todo",
  description: "Generate Tasks & Manage User app",
  manifest: "/manifest.json",
  keywords: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Task Management",
    "Productivity",
    "To-Do List",
    "Project Management",
  ],
  authors: [
    {
      name: "Vaishnavi",
      url: "https://www.linkedin.com/in/vaishnavi-rastogi-104501194/",
    },
  ],
  icons: [
    {
      rel: "apple-touch-icons",
      url: "/public/icons/Greedy-todo-icons-512.png",
    },
    { rel: "icon", url: "/public/icons/Greedy-todo-icons-512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/public/icons/Greedy-todo-icons-512.png" />
        <link
          rel="apple-touch-icon"
          href="/public/icons/Greedy-todo-icons-512.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TaskCountProvider>{children}</TaskCountProvider>
      </body>
    </html>
  );
}
