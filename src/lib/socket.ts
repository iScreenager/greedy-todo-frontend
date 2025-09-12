import { io } from "socket.io-client";

const URL = "https://greedy-todo-backend.onrender.com";
export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
