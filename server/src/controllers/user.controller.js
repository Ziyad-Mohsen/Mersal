import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .skip(offset)
      .limit(limit)
      .populate("posts", "title content postImage likes comments")
      .select("-email");

    const totalUsers = await User.countDocuments(query);

    const result = {
      data: users,
      meta: {
        totalUsers,
        currentPage: page,
        nextPage: page + 1,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get users controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPopularUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    let users;

    const token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      users = await User.find({ _id: { $ne: decoded.userId } });
    } else {
      users = await User.find()
        .skip(offset)
        .limit(limit)
        .populate("posts", "title content postImage likes comments")
        .sort({ followersCount: -1 })
        .select("-email");
    }

    const totalUsers = users.length;

    const result = {
      data: users,
      meta: {
        totalUsers,
        currentPage: page,
        nextPage: page + 1,
        limit,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get popular users controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // First, get the total number of posts for the user without limit or offset
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "author comments.commenter",
        select: "username fullName profilePic",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total posts and total pages based on all the posts
    const totalPosts = user.posts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    // Now, apply the limit and offset to fetch the posts
    const posts = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "author comments.commenter",
        select: "username fullName profilePic",
      },
      options: {
        sort: { createdAt: -1 },
        limit: limit,
        skip: offset,
      },
    });

    const result = {
      data: posts.posts, // Return the posts (not the full user object)
      meta: {
        totalPosts, // Total number of posts
        totalPages, // Total number of pages
        currentPage: page,
        nextPage: page + 1,
        limit,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get user posts controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-email");

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in get user by id controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate("following", "-email")
      .select("-email");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user.following);
  } catch (error) {
    console.log("Error in get following users controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate("followers", "-email")
      .select("-email");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.log("Error in get followers users controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const followAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(404).json({ message: "Invalid User ID" });
    }

    const account = await User.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (account.id === req.user.id) {
      return res
        .status(404)
        .json({ message: "Can not follow your own account" });
    }

    if (account.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    account.followers.push(userId);
    account.save();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: accountId },
      },
      { new: true }
    ).select("-email");

    res.json({ success: true, user });
  } catch (error) {
    console.log("Error in follow user controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unfollowAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(404).json({ message: "Invalid User ID" });
    }

    const account = await User.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (account.id === req.user.id) {
      return res
        .status(404)
        .json({ message: "Can not follow your own account" });
    }

    if (!account.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already unfollowed this user" });
    }

    account.followers = account.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    account.save();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: accountId },
      },
      { new: true }
    ).select("-email");

    res.json({ success: true, user });
  } catch (error) {
    console.log("Error in follow user controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
