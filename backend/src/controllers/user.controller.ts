import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user.model.ts";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import type { User } from "../interfaces/user.interface.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // Database operations
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(409, "User with this email already exists");
      return next(error);
    }
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while getting user");
    return next(httpError);
  }
  // Hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({ name, email, password: hashedPassword });
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while creating user");
    return next(httpError);
  }
  // Token generation JWT
  try {
    const accessToken = Jwt.sign({ id: newUser._id }, config.jwtSecret as string, { expiresIn: "5m" });
    const refreshToken = Jwt.sign({ id: newUser._id }, config.jwtRefreshSecret as string, { expiresIn: "7d" });
    newUser.refreshToken = refreshToken;
    await userModel.findByIdAndUpdate(newUser._id, { refreshToken });
    // Response
    res.status(201).json({ message: "User registered successfully", id: newUser._id, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while signing JWT token");
    return next(httpError);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // Database operations
  let user: User | null;
  try {
    user = await userModel.findOne({ email: email });
    if (!user) {
      const error = createHttpError(401, "Invalid email or password");
      return next(error);
    }
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while getting user");
    return next(httpError);
  }
  // Comparing password
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = createHttpError(401, "Invalid email or password");
      return next(error);
    }
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while comparing passwords");
    return next(httpError);
  }
  // Token generation JWT
  try {
    const accessToken = Jwt.sign({ id: user._id }, config.jwtSecret as string, { expiresIn: "5m" });
    const refreshToken = Jwt.sign({ id: user._id }, config.jwtRefreshSecret as string, { expiresIn: "7d" });
    await userModel.findByIdAndUpdate(user._id, { refreshToken });
    // Response
    res.status(200).json({ message: "User logged in successfully", id: user._id, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while signing JWT token");
    return next(httpError);
  }
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(createHttpError(400, "Refresh token is required"));
  }

  try {
    const decoded = Jwt.verify(refreshToken, config.jwtRefreshSecret as string) as Jwt.JwtPayload;
    if (!decoded || !decoded.id) {
      return next(createHttpError(401, "Invalid refresh token payload"));
    }

    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(createHttpError(401, "Invalid or revoked refresh token"));
    }

    const newAccessToken = Jwt.sign({ id: user._id }, config.jwtSecret as string, { expiresIn: "5m" });
    const newRefreshToken = Jwt.sign({ id: user._id }, config.jwtRefreshSecret as string, { expiresIn: "7d" });

    await userModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return next(createHttpError(401, "Invalid or expired refresh token"));
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { refreshToken: null });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return next(createHttpError(500, "Error occurred during logout"));
  }
};

export { createUser, loginUser, refreshAccessToken, logoutUser };
