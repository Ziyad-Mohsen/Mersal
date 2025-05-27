import jwt from "jsonwebtoken";
import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

export const generateToken = (userId, res) => {
  const expireAtDays = 7;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${expireAtDays}d`,
  });

  res.cookie("jwt", token, {
    maxAge: expireAtDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export const streamUpload = (fileBuffer, folderName) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
