import { Router, Response, NextFunction } from "express";
import { body } from "express-validator";
import * as jobController from "../controllers/job.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { AuthRequest } from "../types";

const router = Router();

// GET /api/v1/jobs  (public)
router.get("/", (req, res, next) =>
  jobController.getAllJobs(req as AuthRequest, res as Response, next as NextFunction)
);

// GET /api/v1/jobs/:id  (public)
router.get("/:id", (req, res, next) =>
  jobController.getJobById(req as AuthRequest, res as Response, next as NextFunction)
);

// Protected routes
router.use(protect);

// POST /api/v1/jobs  (employer only)
router.post(
  "/",
  restrictTo("employer", "admin"),
  [
    body("title").trim().notEmpty().withMessage("Job title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("company").trim().notEmpty().withMessage("Company name is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("type")
      .isIn(["full-time", "part-time", "contract", "internship", "remote"])
      .withMessage("Invalid job type"),
  ],
  validate,
  (req: AuthRequest, res: Response, next: NextFunction) =>
    jobController.createJob(req, res, next)
);

// PUT /api/v1/jobs/:id  (employer only)
router.put(
  "/:id",
  restrictTo("employer", "admin"),
  (req: AuthRequest, res: Response, next: NextFunction) =>
    jobController.updateJob(req, res, next)
);

// DELETE /api/v1/jobs/:id  (employer only)
router.delete(
  "/:id",
  restrictTo("employer", "admin"),
  (req: AuthRequest, res: Response, next: NextFunction) =>
    jobController.deleteJob(req, res, next)
);

export default router;
