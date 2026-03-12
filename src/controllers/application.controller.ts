import { Request, Response } from "express";
import Application from "../models/application.model";

// POST /api/applications - Submit a job application
export const submitApplication = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "TODO: Submit application" });
};

// We reference Application model to avoid unused import warning
const _App = Application;
