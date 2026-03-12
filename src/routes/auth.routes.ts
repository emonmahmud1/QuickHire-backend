import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { AuthRequest } from "../types";
import { Response, NextFunction } from "express";

const router = Router();

// POST /api/v1/auth/register
router.post(
  "/register",
  authRateLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .optional()
      .isIn(["jobseeker", "employer"])
      .withMessage("Role must be jobseeker or employer"),
  ],
  validate,
  authController.register
);

// POST /api/v1/auth/login
router.post(
  "/login",
  authRateLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authController.login
);

// POST /api/v1/auth/refresh-token
router.post("/refresh-token", authController.refreshToken);

// GET /api/v1/auth/me
router.get("/me", protect, (req, res, next) =>
  authController.getMe(req as AuthRequest, res as Response, next as NextFunction)
);

export default router;
