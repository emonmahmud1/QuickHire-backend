import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import Job from "../models/job.model";
import { sendSuccess, sendPaginated } from "../utils/response";
import { AppError } from "../utils/AppError";

export const getAllJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { status: "open" };

    if (req.query.type) filter.type = req.query.type;
    if (req.query.location) {
      filter.location = { $regex: req.query.location as string, $options: "i" };
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("postedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    sendPaginated(res, jobs, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) {
      throw new AppError("Job not found.", 404);
    }
    sendSuccess(res, job, "Job fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user?.id });
    sendSuccess(res, job, "Job created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user?.id });
    if (!job) {
      throw new AppError("Job not found or unauthorized.", 404);
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    sendSuccess(res, updatedJob, "Job updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user?.id });
    if (!job) {
      throw new AppError("Job not found or unauthorized.", 404);
    }
    await Job.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, "Job deleted successfully");
  } catch (error) {
    next(error);
  }
};
