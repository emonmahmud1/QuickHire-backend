import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Start server first so it's always reachable
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  // Connect DB independently — server stays up even if DB is unreachable
  await connectDB();
};

startServer();
