import { Request, Response } from "express";
import Job from "../models/job.model";

// GET /api/jobs - Get all jobs
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Optional query filters: ?category=Design&location=Dhaka
    const filter: Record<string, unknown> = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.location) {
      // case-insensitive partial match
      filter.location = { $regex: req.query.location as string, $options: "i" };
    }

    const jobs = await Job.find(filter).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch jobs.",
    });
  }
};

// GET /api/jobs/:id - Get single job details
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    // If the id format is invalid (not a valid MongoDB ObjectId)
    res.status(400).json({
      success: false,
      message: "Invalid job ID format.",
    });
  }
};

// POST /api/jobs - Create a job (Admin or User)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, company, location, category, description } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      category,
      description,
      postedBy: req.user?.id, // Save who posted the job
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not create job.",
    });
  }
};

// DELETE /api/jobs/:id - Delete a job (Admin only)
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid job ID format.",
    });
  }
};

// GET /api/jobs/my/posted - Get jobs posted by current user
export const getMyJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ postedBy: req.user?.id }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch jobs.",
    });
  }
};
