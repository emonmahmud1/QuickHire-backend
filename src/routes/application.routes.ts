import { Router } from "express";
import { body } from "express-validator";
import { submitApplication } from "../controllers/application.controller";
import { validate } from "../middlewares/validate";

const router = Router();

// POST /api/applications
router.post(
  "/",
  [
    body("job_id")
      .notEmpty()
      .withMessage("job_id is required")
      .isMongoId()
      .withMessage("job_id must be a valid ID"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be a valid email address"),

    body("resume_link")
      .trim()
      .notEmpty()
      .withMessage("Resume link is required")
      .isURL()
      .withMessage("Resume link must be a valid URL"),

    body("cover_note")
      .optional()
      .trim(),
  ],
  validate,
  submitApplication
);

export default router;
