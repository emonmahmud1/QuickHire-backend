import { Request, Response } from "express";
import mongoose from "mongoose";
import Application from "../models/application.model";
import Job from "../models/job.model";

// POST /api/applications - Submit a job application
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { job_id, name, email, resume_link, cover_note } = req.body;

    // Check if the job exists
    const jobExists = await Job.findById(job_id);
    if (!jobExists) {
      res.status(404).json({
        success: false,
        message: "Job not found. Please provide a valid job_id.",
      });
      return;
    }

    // Check if this email already applied to this job
    const alreadyApplied = await Application.findOne({ job_id, email });
    if (alreadyApplied) {
      res.status(409).json({
        success: false,
        message: "You have already applied for this job with this email.",
      });
      return;
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      resume_link,
      cover_note: cover_note || "",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId for job_id
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "Invalid job_id format.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not submit application.",
    });
  }
};

// GET /api/applications/my - Get applications for jobs posted by current user
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all jobs posted by current user
    const myJobs = await Job.find({ postedBy: req.user?.id }).select("_id");
    const jobIds = myJobs.map((job) => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({
      job_id: { $in: jobIds },
    })
      .populate("job_id", "title company")
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch applications.",
    });
  }
};
