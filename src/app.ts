import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "QuickHire API is running" });
});

// In serverless environments, ensure DB is ready before handling API routes.
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
