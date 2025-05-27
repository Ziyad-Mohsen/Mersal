import express from "express";
import {
  followAccount,
  getUserFollowing,
  getPopularUsers,
  getUserById,
  getUserPosts,
  getUsers,
  unfollowAccount,
  getUserFollowers,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/popular", getPopularUsers);

router.get("/:id/posts", protectRoute, getUserPosts);

router.get("/:id/following", protectRoute, getUserFollowing);

router.get("/:id/followers", protectRoute, getUserFollowers);

router.get("/:id", getUserById);

router.post("/:id/follow", protectRoute, followAccount);

router.post("/:id/unfollow", protectRoute, unfollowAccount);

export default router;
