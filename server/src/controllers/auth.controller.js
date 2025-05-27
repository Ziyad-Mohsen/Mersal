import {
  loginValidator,
  signupValidator,
  updateProfileValidator,
} from "../lib/userValidator.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { streamUpload } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const imgFile = req.file;
    const valid = signupValidator(req.body);
    if (!valid) {
      console.log("invalid");
      const message = signupValidator.errors[0].message;
      return res.status(400).json({ message });
    }

    // Check if the user already exists
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let uploadResponse;

    if (imgFile) {
      uploadResponse = await streamUpload(imgFile.buffer, "profile-pics");
    }

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      profilePic: uploadResponse
        ? {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          }
        : undefined,
    });
    console.log(newUser);

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const valid = loginValidator(req.body);
    if (!valid) {
      const message = signupValidator.errors[0].message;
      return res.status(400).json({ message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.json(user);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const fullName = req.body?.fullName;
    const username = req.body?.username;
    const email = req.body?.email;
    const profilePic = req.file;
    const userId = req.user._id;

    const updatedData = {};

    if (fullName) updatedData.fullName = fullName;
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;

    const valid = updateProfileValidator(updatedData);

    if (!valid) {
      return res
        .status(400)
        .json({ message: updateProfileValidator.errors[0].message });
    }

    if (profilePic) {
      const user = await User.findById(userId);
      if (user.profilePic.publicId)
        await cloudinary.uploader.destroy(user.profilePic.publicId);

      const uploadResponse = await streamUpload(
        profilePic.buffer,
        "profile-pics"
      );

      const image = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      };

      updatedData.profilePic = image;
    }

    // Check if email already exists (and is not for the same user)
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (
        existingEmailUser &&
        existingEmailUser._id.toString() !== req.user.id
      ) {
        return res.status(400).json({ Message: "Email is already taken." });
      }
    }

    // Check if username already exists (and is not for the same user)
    if (username) {
      const existingUsernameUser = await User.findOne({ username });
      if (
        existingUsernameUser &&
        existingUsernameUser._id.toString() !== req.user.id
      ) {
        return res.status(400).json({ message: "Username is already taken." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.profilePic.publicId) {
      await cloudinary.uploader.destroy(user.profilePic.publicId);
    }

    await user.deleteOne();

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("error in delete profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
