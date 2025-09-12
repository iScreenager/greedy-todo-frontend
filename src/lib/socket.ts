import { io } from "socket.io-client";

const URL = process.env.BACKEND_URL || "http://localhost:8000";
export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
