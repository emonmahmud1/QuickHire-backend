import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";

const app: Application = express();

// --- Security Middlewares ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(rateLimiter);

// --- Parsing Middlewares ---
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Health Check ---
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "QuickHire API is running" });
});

// --- API Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
