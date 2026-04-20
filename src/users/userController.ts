import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import type { User } from "./userTypes.ts";

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
    const token = Jwt.sign({ id: newUser._id }, config.jwtSecret as string, { expiresIn: "1d" });
    // Response
    res.status(201).json({ message: "User registered successfully", id: newUser._id, accessToken: token });

  } catch (error) {
    console.error(error);
    const httpError = createHttpError(500, "Error occurred while signing JWT token");
    return next(httpError);
  }
};

export { createUser };
