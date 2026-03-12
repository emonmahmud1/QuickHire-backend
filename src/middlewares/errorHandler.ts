import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  errors?: Record<string, { message: string }>;
}

const handleCastError = (err: MongoError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err: MongoError): AppError => {
  const field = Object.keys(err.keyValue || {})[0];
  const message = `Duplicate value for field: ${field}. Please use another value.`;
  return new AppError(message, 409);
};

const handleValidationError = (err: MongoError): AppError => {
  const errors = Object.values(err.errors || {}).map((e) => e.message);
  const message = `Validation failed: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Token has expired. Please log in again.", 401);

export const errorHandler = (
  err: AppError & MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err, message: err.message, name: err.name };

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
    return;
  }

  res.status(statusCode).json({ success: false, message });
};
