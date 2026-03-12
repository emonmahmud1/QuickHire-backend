import { Router, Response, NextFunction } from "express";
import * as userController from "../controllers/user.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types";

const router = Router();

// All routes require authentication
router.use(protect);

// GET /api/v1/users
router.get("/", restrictTo("admin"), (req, res, next) =>
  userController.getAllUsers(req as AuthRequest, res as Response, next as NextFunction)
);

// GET /api/v1/users/:id
router.get("/:id", (req, res, next) =>
  userController.getUserById(req as AuthRequest, res as Response, next as NextFunction)
);

// PUT /api/v1/users/profile
router.put("/profile", (req, res, next) =>
  userController.updateProfile(req as AuthRequest, res as Response, next as NextFunction)
);

// DELETE /api/v1/users/:id
router.delete("/:id", restrictTo("admin"), (req, res, next) =>
  userController.deleteUser(req as AuthRequest, res as Response, next as NextFunction)
);

export default router;
