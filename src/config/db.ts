import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS — fixes MongoDB Atlas SRV lookup failures on restrictive ISPs
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let cachedConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI as string;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (mongoose.connection.readyState === 1) return;

  if (!cachedConnectionPromise) {
    cachedConnectionPromise = mongoose.connect(mongoUri, {
      family: 4, // Force IPv4 — fixes DNS SRV resolution on Windows
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    const conn = await cachedConnectionPromise;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    cachedConnectionPromise = null;
    console.error("[MongoDB] Connection error:", error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("[MongoDB] Disconnected");
};
