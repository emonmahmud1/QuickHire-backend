import { Router, Response, NextFunction } from "express";
import * as appController from "../controllers/application.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types";

const router = Router();

// All routes require auth
router.use(protect);

// POST /api/v1/applications/jobs/:jobId
router.post("/jobs/:jobId", restrictTo("jobseeker"), (req, res, next) =>
  appController.applyForJob(req as AuthRequest, res as Response, next as NextFunction)
);

// GET /api/v1/applications/my
router.get("/my", restrictTo("jobseeker"), (req, res, next) =>
  appController.getMyApplications(req as AuthRequest, res as Response, next as NextFunction)
);

// GET /api/v1/applications/jobs/:jobId
router.get("/jobs/:jobId", restrictTo("employer", "admin"), (req, res, next) =>
  appController.getJobApplications(req as AuthRequest, res as Response, next as NextFunction)
);

// PATCH /api/v1/applications/:id/status
router.patch(
  "/:id/status",
  restrictTo("employer", "admin"),
  (req, res, next) =>
    appController.updateApplicationStatus(
      req as AuthRequest,
      res as Response,
      next as NextFunction
    )
);

export default router;
