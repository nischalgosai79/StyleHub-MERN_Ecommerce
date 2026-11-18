import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Connect database
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

// Main route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to StyleHub API",
    status: "Running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", siteSettingsRoutes);
// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StyleHub server running on port ${PORT}`);
});