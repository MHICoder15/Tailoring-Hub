import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import bookModel from "./bookModel.ts";
import { unlink } from "node:fs/promises";
import createHttpError from "http-errors";
import type { Book } from "./bookTypes.ts";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, genre } = req.body;
  // Validation
  if (!title || !author || !genre) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // Cover image upload
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageFile = files.coverImage?.[0];
  if (!files || !coverImageFile) {
    return res.status(400).json({ error: "Cover image is required" });
  }
  const fileName = coverImageFile?.filename;
  const filePath = path.join(process.cwd(), "public/data/uploads", fileName);
  const coverImageMimetype = coverImageFile?.mimetype.split("/")[1] as string;
  const displayName = coverImageFile?.originalname;
  let uploadCoverImage;
  try {
    uploadCoverImage = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "cover_images",
      format: coverImageMimetype,
      display_name: displayName
    });
  } catch (error) {
    console.error("Error uploading cover image:", error);
    const httpError = createHttpError(500, "Error occurred while uploading cover image");
    return next(httpError);
  }
  // Book file upload
  const bookFile = files.file?.[0];
  if (!files || !bookFile) {
    return res.status(400).json({ error: "Book file is required" });
  }
  const bookFileName = bookFile?.filename;
  const bookFilePath = path.join(process.cwd(), "public/data/uploads", bookFileName);
  const bookFileMimetype = bookFile?.mimetype.split("/")[1] as string;
  const bookDisplayName = bookFile?.originalname;
  let uploadBookFile;
  try {
    uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book_pdfs",
      format: bookFileMimetype,
      display_name: bookDisplayName
    });
  } catch (error) {
    console.error("Error uploading book file:", error);
    const httpError = createHttpError(500, "Error occurred while uploading book file");
    return next(httpError);
  }
  // Database operations
  try {
    const newBook: Book = await bookModel.create({
      title,
      author,
      genre,
      coverImage: uploadCoverImage.secure_url,
      file: uploadBookFile.secure_url
    });
    // Remove temporary files after public folder
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting cover image file:", error);
      const httpError = createHttpError(500, "Error occurred while deleting cover image file");
      return next(httpError);
    }
    try {
      await unlink(bookFilePath);
    } catch (error) {
      console.error("Error deleting book file:", error);
      const httpError = createHttpError(500, "Error occurred while deleting book file");
      return next(httpError);
    }
    // Response
    res.json({ id: newBook._id, message: "Book created successfully" });
  } catch (error) {
    console.error("Error creating book in database:", error);
    const httpError = createHttpError(500, "Error occurred while creating book");
    return next(httpError);
  }


};

export { createBook };
