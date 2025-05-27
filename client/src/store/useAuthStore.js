import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLogging: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isLogging: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      Navigate({ to: "/" });
    } catch (error) {
      console.log(console.log("Error in Signup:", error));
      toast.error(error.response.data.message);
    } finally {
      set({ isLogging: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLogging: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      Navigate({ to: "/" });
    } catch (error) {
      console.log(console.log("Error in Login:", error));
      toast.error(error.response.data.message);
    } finally {
      set({ isLogging: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      toast.success(res.data.message);
      set({ authUser: null });
    } catch (error) {
      console.log(console.log("Error in Logout:", error.response.data.message));
    }
  },

  deleteProfile: async () => {
    try {
      const res = await axiosInstance.delete("/auth/deleteProfile");
      toast.success(res.data.message);
      set({ authUser: null });
      return res.data.message;
    } catch (error) {
      console.log("error in delete profile", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      return res.status;
    } catch (error) {
      console.log("Error in updating profile", error);
      toast.error(error.response.data.message);
      return error?.response.status;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
