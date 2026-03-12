import { Router } from "express";
import { body } from "express-validator";
import { getAllJobs, getJobById, createJob, deleteJob, getMyJobs } from "../controllers/job.controller";
import { protect, adminOnly } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();

// GET /api/jobs
router.get("/", getAllJobs);

// GET /api/jobs/my/posted - Get jobs posted by current user (Protected)
router.get("/my/posted", protect, getMyJobs);

// GET /api/jobs/:id
router.get("/:id", getJobById);

// POST /api/jobs  (Protected - any logged in user can post)
router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("company")
      .trim()
      .notEmpty()
      .withMessage("Company is required"),

    body("location")
      .trim()
      .notEmpty()
      .withMessage("Location is required"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
  ],
  validate,
  createJob
);

// DELETE /api/jobs/:id  (Admin only)
router.delete("/:id", protect, adminOnly, deleteJob);

export default router;
