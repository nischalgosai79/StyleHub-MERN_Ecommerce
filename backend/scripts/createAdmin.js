import "dotenv/config";

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
      throw new Error(
        "Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env"
      );
    }

    let admin = await User.findOne({ email });

    if (admin) {
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
      }

      console.log("Existing account promoted to admin:", email);
    } else {
      admin = await User.create({
        name,
        email,
        password,
        role: "admin",
      });

      console.log("Admin account created successfully!");
    }

    console.log("Admin email:", email);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

createAdmin();