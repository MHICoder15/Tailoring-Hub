import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/config.ts";

export interface AuthRequest extends Request {
  userId?: string;
}

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("authorization");
  if (!token) {
    return next(createHttpError(401, "Access token is missing"));
  }
  const parsedToken = token.split(" ")[1];
  if (!parsedToken) {
    return next(createHttpError(401, "Invalid token format"));
  }
  try {
    const decodedToken = jwt.verify(parsedToken, config.jwtSecret as string);
    if (typeof decodedToken === "object" && decodedToken !== null) {
      const _req = req as AuthRequest;
      _req.userId = (decodedToken as JwtPayload).id as string;
    } else {
      return next(createHttpError(401, "Invalid token payload"));
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authentication;