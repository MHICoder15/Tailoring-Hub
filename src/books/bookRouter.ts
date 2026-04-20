import express from "express";
import { createBook } from "./bookController.ts";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bookRouter = express.Router();

// File store locally
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 } // 30MB
});

// For single file upload
// bookRouter.post("/register", upload.single("file"), createBook);

// For multiple file upload
bookRouter.post("/", upload.fields([
  { name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }
]), createBook);

export default bookRouter;