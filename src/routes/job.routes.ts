import { Router } from "express";
import { getAllJobs, getJobById, createJob, deleteJob } from "../controllers/job.controller";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// GET /api/jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id
router.get("/:id", getJobById);

// POST /api/jobs  (Admin only)
router.post("/", adminAuth, createJob);

// DELETE /api/jobs/:id  (Admin only)
router.delete("/:id", adminAuth, deleteJob);

export default router;
