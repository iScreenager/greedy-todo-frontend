import { io } from "socket.io-client";

const URL = process.env.BACKEND_URL;
export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
