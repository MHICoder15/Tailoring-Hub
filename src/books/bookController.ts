import type { Request, Response } from "express";

const createBook = async (req: Request, res: Response) => {
  console.log("Files received:", req.files);

  res.json({});

};

export { createBook };
