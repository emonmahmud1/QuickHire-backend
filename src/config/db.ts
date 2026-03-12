import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS — fixes MongoDB Atlas SRV lookup failures on restrictive ISPs
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI as string;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUri, {
      family: 4, // Force IPv4 — fixes DNS SRV resolution on Windows
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    // Don't exit — server will still respond, but DB queries will fail
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("[MongoDB] Disconnected");
};
