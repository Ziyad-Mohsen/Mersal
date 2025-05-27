import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePostsStore = create((set, get) => ({
  posts: { data: [], meta: {} },
  followingPosts: { data: [], meta: {} },
  userPosts: { data: [], meta: {} },
  activeFeed: "explore",
  isPostsLoading: false,
  isCreatingPost: false,
  isDeletingPost: false,
  isLoadingUserPosts: false,

  setActiveFeed: (newTap) => {
    set({ activeFeed: newTap });
  },

  getPosts: async (page = 1) => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get(`/posts?page=${page}`);
      const { data, meta } = res.data;
      set((state) => ({
        posts: {
          data: page === 1 ? data : [...state.posts.data, ...data],
          meta,
        },
      }));
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      set({ isPostsLoading: false });
    }
  },

  getUserPosts: async (id, page = 1) => {
    try {
      set({ isLoadingUserPosts: true });
      const res = await axiosInstance.get(
        `/users/${id}/posts?page=${page}&limit=5`
      );
      const { data, meta } = res.data;
      set((state) => ({
        userPosts: {
          data: page === 1 ? data : [...state.userPosts.data, ...data],
          meta,
        },
      }));
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      set({ isLoadingUserPosts: false });
    }
  },

  updatePost: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/posts/${id}`, data);
      return res.data;
    } catch (error) {
      console.log("error in updating post", error);
    }
  },

  createPost: async (data) => {
    set({ isCreatingPost: true });
    try {
      const res = await axiosInstance.post("/posts", data);
      toast.success(res.data.message);

      await usePostsStore.getState().getPosts();

      return res.data;
    } catch (error) {
      console.log("Error creating post", error);
      toast.error("Error creating post");
    } finally {
      set({ isCreatingPost: false });
    }
  },

  deletePost: async (id) => {
    // set({ isDeletingPost: true });
    // try {
    //   const res = await axiosInstance.delete(`/posts/${id}`);
    //   get().getUserPosts();
    //   return res.data;
    // } catch (error) {
    //   console.log("error deleting posts", error);
    // } finally {
    //   set({ isDeletingPost: false });
    // }

    // Optimistically remove post from UI
    set((state) => ({
      userPosts: {
        ...state.userPosts,
        data: state.userPosts.data.filter((post) => post.id !== id),
      },
    }));

    try {
      await axiosInstance.delete(`/posts/${id}`);
      toast.success("Post deleted");
    } catch (error) {
      // Rollback UI if the request fails
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post. Please try again.");

      // Re-fetch posts or restore the post (depends on your logic)
      get().getUserPosts();
    }
  },

  getFollowingPosts: async (page = 1) => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/following?page=${page}`);
      const { data, meta } = res.data;
      set((state) => ({
        followingPosts: {
          data: page === 1 ? data : [...state.followingPosts.data, ...data],
          meta,
        },
      }));
    } catch (error) {
      console.log("Error fetching following posts", error);
    } finally {
      set({ isPostsLoading: false });
    }
  },

  getPostById: async (id) => {
    try {
      const res = await axiosInstance.get(`/posts/show/${id}`);
      return res.data;
    } catch (error) {
      console.log("error in getting post by id", error);
    }
  },

  addComment: async (id, data) => {
    try {
      const res = await axiosInstance.post(`/posts/${id}/comment`, data);
      return res.data;
    } catch (error) {
      console.log("error in adding comment", error);
    }
  },

  addLike: async (id) => {
    try {
      const res = await axiosInstance.post(`/posts/${id}/like`);
      return res.data;
    } catch (error) {
      console.log("Error adding like to post", error);
    }
  },

  removeLike: async (id) => {
    try {
      const res = await axiosInstance.delete(`/posts/${id}/removeLike`);
      return res.data;
    } catch (error) {
      console.log("Error removing like from post", error);
    }
  },
}));
