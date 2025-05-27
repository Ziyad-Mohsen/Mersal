import mongoose from "mongoose";
import Post from "../models/post.model.js";
import postValidator from "../lib/postValidator.js";
import { streamUpload } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const posts = await Post.find()
      .skip(offset)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username fullName profilePic")
      .populate("comments.commenter", "username fullName profilePic");

    const totalPosts = await Post.countDocuments();

    const result = {
      data: posts,
      meta: {
        totalPosts,
        currentPage: page,
        nextPage: page + 1,
        totalPages: Math.ceil(totalPosts / limit),
        limit,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get posts controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const user = await User.findById(req.user._id);

    const followingIds = user.following;

    const posts = await Post.find({
      author: { $in: followingIds },
    })
      .skip(offset)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username fullName profilePic")
      .populate("comments.commenter", "username fullName profilePic");

    const totalPosts = posts.length;
    const result = {
      data: posts,
      meta: {
        totalPosts,
        currentPage: page,
        nextPage: page + 1,
        limit,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get following posts controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(id)
      .populate("author", "username fullName profilePic")
      .populate("likes", "username fullName profilePic")
      .populate("comments.commenter", "username fullName profilePic");

    if (!post) {
      res.status(404).json({ message: "Post Not Found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in get post by id controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postImage = req.file;

    const valid = postValidator({ title, content, postImage });

    if (!valid) {
      const message = postValidator.errors[0].message;
      return res.status(400).json({ message });
    }

    let uploadResponse;

    if (postImage) {
      uploadResponse = await streamUpload(postImage.buffer, "post-images");
    }

    const newPost = new Post({
      title,
      content,
      postImage: uploadResponse
        ? {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          }
        : undefined,
      author: req.user._id,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { posts: newPost._id },
      },
      { new: true }
    );

    if (newPost) {
      await newPost.save();
      return res.status(201).json({
        message: "Post created successfully",
        data: {
          title: newPost.title,
          content: newPost.content,
          postImage: newPost.postImage,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in create post controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = req.post;

    if (post.postImage.publicId)
      await cloudinary.uploader.destroy(post.postImage.publicId);

    await post.deleteOne();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log("Error in delete post controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = req.post;
    const title = req.body?.title;
    const content = req.body?.content;
    const postImage = req.file;
    const updatedData = {};

    if (title) updatedData.title = title;
    if (content) updatedData.content = content;
    if (postImage) updatedData.postImage = postImage;

    const valid = postValidator(updatedData);

    if (!valid) {
      const message = postValidator.errors[0].message;
      return res.status(400).json({ message });
    }

    if (postImage) {
      if (post.publicId)
        await cloudinary.uploader.destroy(post.postImage.publicId);

      const uploadResponse = await streamUpload(
        postImage.buffer,
        "post-images"
      );

      const image = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      };

      updatedData.postImage = image;
    }

    const updatedPost = await Post.findByIdAndUpdate(post.id, updatedData, {
      new: true,
    }).populate("author", "username fullName profilePic");
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("Error in update post controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ message: "Invalid Post ID" });
    }

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const newComment = {
      text: comment,
      commenter: req.user.id,
    };

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            $each: [newComment],
            $position: 0, // Adds to the beginning
          },
        },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const commenter = await User.findById(req.user.id).select(
      "username fullName profilePic id"
    );

    res.status(201).json({
      ...newComment,
      commenter: commenter,
      createdAt: Date.now(),
      success: true,
    });
  } catch (error) {
    console.log("Error in create comment controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.likes.includes(userId)) {
      return res.status(404).json({ message: "Already liked this post" });
    }

    const likedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    res.status(200).json({ success: true, likes: likedPost.likes });
  } catch (error) {
    console.log("Error in add like controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (!post.likes.includes(userId)) {
      return res
        .status(404)
        .json({ message: "Already removed like on this post" });
    }

    const likedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    res.status(201).json({ success: true, likes: likedPost.likes });
  } catch (error) {
    console.log("Error in add like controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
