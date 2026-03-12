import mongoose, { Schema } from "mongoose";
import { IJob } from "../types";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      required: [true, "Job type is required"],
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "BDT" },
    },
    skills: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for search
jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ status: 1, createdAt: -1 });

const Job = mongoose.model<IJob>("Job", jobSchema);
export default Job;
