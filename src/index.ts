import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect DB once at cold start; API middleware will ensure retries if needed.
connectDB().catch((error) => {
  console.error("[MongoDB] Initial connection attempt failed:", error);
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
