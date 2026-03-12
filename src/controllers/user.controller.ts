import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import User from "../models/user.model";
import { sendSuccess, sendPaginated } from "../utils/response";
import { AppError } from "../utils/AppError";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select("-password"),
      User.countDocuments(),
    ]);

    sendPaginated(res, users, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found.", 404);
    }
    sendSuccess(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    sendSuccess(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
