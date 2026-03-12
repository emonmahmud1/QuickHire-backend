import { Request, Response, NextFunction } from "express";

// Simple Admin authentication using a secret key in the header
// Usage: Add header  x-admin-key: <your ADMIN_KEY from .env>
export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin key required.",
    });
    return;
  }

  next();
};
