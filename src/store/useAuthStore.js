import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; 

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,

  allUsers: [],
isFetchingAllUsers: false,

fetchAllUsers: async () => {
  set({ isFetchingAllUsers: true });

  try {
    const res = await axiosInstance.get("/allusers");

    console.log("FETCHED USERS:", res.data); 

    set({ allUsers: res.data });
  } catch (err) {
    console.error("Fetch all users failed:", err);
    set({ allUsers: [] });
  } finally {
    set({ isFetchingAllUsers: false });
  }
},


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null, onlineUsers: [] });
    } catch (err) {
      toast.error("Logout failed");
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      query: {
        userId: authUser.user_id,
      },
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("getOnlineUsers", (users) => {
      // users = [{ userId, name, profile, socketId }]
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
