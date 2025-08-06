// ✅ src/socket.ts
import { io } from "socket.io-client";

// 🛠️ Use correct backend URL in production
const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL;
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
