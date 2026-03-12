import { Router } from "express";
import { body } from "express-validator";
import { getAllJobs, getJobById, createJob, deleteJob } from "../controllers/job.controller";
import { adminAuth } from "../middlewares/adminAuth";
import { validate } from "../middlewares/validate";

const router = Router();

// GET /api/jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id
router.get("/:id", getJobById);

// POST /api/jobs  (Admin only)
router.post(
  "/",
  adminAuth,
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
router.delete("/:id", adminAuth, deleteJob);

export default router;
