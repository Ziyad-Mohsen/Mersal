import express from "express";
import {
  checkAuth,
  deleteProfile,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);

router.post("/login", login);

router.post("/logout", logout);

router.put(
  "/updateProfile",
  upload.single("profilePic"),
  protectRoute,
  updateProfile
);

router.delete("/deleteProfile", protectRoute, deleteProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
