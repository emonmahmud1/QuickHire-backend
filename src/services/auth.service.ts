import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { config } from "../config/config";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types";

const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "jobseeker" | "employer"
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User with this email already exists.", 409);
  }

  const user = await User.create({ name, email, password, role });
  const tokens = generateTokens({ id: user._id.toString(), role: user.role });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const tokens = generateTokens({ id: user._id.toString(), role: user.role });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
};

export const refreshTokens = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.refreshSecret
    ) as JwtPayload;

    const newTokens = generateTokens({ id: decoded.id, role: decoded.role });
    return newTokens;
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }
};
