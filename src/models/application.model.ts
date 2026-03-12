import mongoose, { Document, Schema } from "mongoose";

// Application document interface
export interface IApplication extends Document {
  job_id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  created_at: Date;
}

const applicationSchema = new Schema({
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Job ID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  resume_link: {
    type: String,
    required: [true, "Resume link is required"],
  },
  cover_note: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model<IApplication>("Application", applicationSchema);
export default Application;
