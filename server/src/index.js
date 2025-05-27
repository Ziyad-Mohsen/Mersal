import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Database connection function
import { connectDB } from "./lib/db.js";

// Routes imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mersal-five.vercel.app/"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
