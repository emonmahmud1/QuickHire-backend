import { Request } from "express";
import { Document, Types } from "mongoose";

// ─── User Types ────────────────────────────────────────────────────────────────

export type UserRole = "jobseeker" | "employer" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Job Types ─────────────────────────────────────────────────────────────────

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote";
export type JobStatus = "open" | "closed" | "draft";

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  status: JobStatus;
  postedBy: Types.ObjectId;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Application Types ─────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface IApplication extends Document {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
