import { Request, Response } from "express";
import Job from "../models/job.model";

// GET /api/jobs - Get all jobs
export const getAllJobs = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "TODO: Get all jobs" });
};

// GET /api/jobs/:id - Get single job
export const getJobById = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "TODO: Get job by id" });
};

// POST /api/jobs - Create a job (Admin)
export const createJob = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "TODO: Create job" });
};

// DELETE /api/jobs/:id - Delete a job (Admin)
export const deleteJob = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "TODO: Delete job" });
};

// We reference Job model to avoid unused import warning
const _Job = Job;
