import express from "express";
import {
  addLike,
  createComment,
  createPost,
  deletePost,
  getFollowingPosts,
  getPostById,
  getPosts,
  removeLike,
  updatePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeUser } from "../middleware/post.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/show/:id", protectRoute, getPostById);
router.post("/", protectRoute, upload.single("postImage"), createPost);
router.delete("/:id", protectRoute, authorizeUser, deletePost);
router.put(
  "/:id",
  protectRoute,
  authorizeUser,
  upload.single("postImage"),
  updatePost
);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, addLike);
router.delete("/:id/removeLike", protectRoute, removeLike);

export default router;
