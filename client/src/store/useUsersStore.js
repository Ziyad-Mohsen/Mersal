import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUsersStore = create((set) => ({
  users: { data: [], meta: {} },
  popularUsers: [],
  isLoadingUsers: false,
  isLoadingPopularUsers: false,
  search: "",

  setSearch: (newSearch) => set({ search: newSearch }),

  getUsers: async (search, page = 1) => {
    try {
      set({ isLoadingUsers: true });
      const res = await axiosInstance.get(
        `/users?search=${search}&page=${page}&limit=5`
      );
      const { data, meta } = res.data;
      set((state) => ({
        users: {
          data: page === 1 ? data : [...state.users.data, ...data],
          meta,
        },
      }));
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  getUser: async (id) => {
    set({ isLoadingUserPosts: true });
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in get user", error);
    } finally {
      set({ isLoadingUserPosts: false });
    }
  },

  getPopularUsers: async (limit) => {
    try {
      set({ isLoadingPopularUsers: true });
      const res = await axiosInstance.get(`/users/popular?limit=${limit}`);
      set({ popularUsers: res.data.data });
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      set({ isLoadingPopularUsers: false });
    }
  },

  followUser: async (id) => {
    try {
      const res = await axiosInstance.post(`/users/${id}/follow`);
      return res.data;
    } catch (error) {
      console.log("Error following user", error);
    }
  },

  unfollowUser: async (id) => {
    try {
      const res = await axiosInstance.post(`/users/${id}/unfollow`);
      return res.data;
    } catch (error) {
      console.log("Error following user", error);
    }
  },
}));
