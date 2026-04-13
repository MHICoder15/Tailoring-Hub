/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";
import { config } from "../config/config.ts";

const globleErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message,
    errorStack: config.nodeEnv == "development" ? err.stack : "",
  });
};

export default globleErrorHandler;
