import Post from "../models/post.model.js";
import mongoose from "mongoose";

export const authorizeUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.post = post;

    next();
  } catch (error) {
    console.log("Error in authorize user middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
