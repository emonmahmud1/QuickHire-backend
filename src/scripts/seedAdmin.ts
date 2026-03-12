/**
 * Admin Seed Script
 * Usage: npm run seed:admin
 *
 * Creates an admin user from environment variables.
 * Run once during initial setup. Safe to run again — skips if admin already exists.
 *
 * Required env vars (or uses defaults for development):
 *   ADMIN_NAME      - Admin display name     (default: "Super Admin")
 *   ADMIN_EMAIL     - Admin login email      (default: "admin@quickhire.com")
 *   ADMIN_PASSWORD  - Admin password         (default: "Admin@123456")
 *   MONGODB_URI     - MongoDB connection URI
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@quickhire.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quickhire";

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === "admin") {
        console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      } else {
        // Promote existing user to admin
        existing.role = "admin";
        await existing.save();
        console.log(`Promoted existing user to admin: ${ADMIN_EMAIL}`);
      }
      await mongoose.disconnect();
      return;
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log("Change the password after first login.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAdmin();
