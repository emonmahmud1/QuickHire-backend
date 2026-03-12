import mongoose, { Document, Schema } from "mongoose";

// Job document interface
export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: Date;
}

const jobSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Company is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model<IJob>("Job", jobSchema);
export default Job;
