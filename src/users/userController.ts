import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // Database operations
  const user = await userModel.findOne({ email: email });
  if(user) {
    const error = createHttpError(409, "User with this email already exists");
    return next(error);
  }
  // Processing
  // Response
  res.json({ message: "User registered successfully" });
};

export { createUser };
