import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import Application from "../models/application.model";
import Job from "../models/job.model";
import { sendSuccess, sendPaginated } from "../utils/response";
import { AppError } from "../utils/AppError";

export const applyForJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== "open") {
      throw new AppError("Job not found or no longer accepting applications.", 404);
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user?.id,
    });
    if (existing) {
      throw new AppError("You have already applied for this job.", 409);
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user?.id,
      ...req.body,
    });

    sendSuccess(res, application, "Application submitted successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ applicant: req.user?.id })
        .populate("job", "title company location type status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ applicant: req.user?.id }),
    ]);

    sendPaginated(res, applications, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      postedBy: req.user?.id,
    });
    if (!job) {
      throw new AppError("Job not found or unauthorized.", 404);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ job: req.params.jobId })
        .populate("applicant", "name email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ job: req.params.jobId }),
    ]);

    sendPaginated(res, applications, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate(
      "job"
    );

    if (!application) {
      throw new AppError("Application not found.", 404);
    }

    const job = await Job.findOne({
      _id: application.job,
      postedBy: req.user?.id,
    });
    if (!job) {
      throw new AppError("Unauthorized to update this application.", 403);
    }

    application.status = status;
    await application.save();
    sendSuccess(res, application, "Application status updated");
  } catch (error) {
    next(error);
  }
};
