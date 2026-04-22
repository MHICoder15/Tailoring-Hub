import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import bookModel from "./bookModel.ts";
import { unlink } from "node:fs/promises";
import createHttpError from "http-errors";
import type { Book } from "./bookTypes.ts";
import type { AuthRequest } from "../middlewares/authentication.ts";

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
  const _req = req as AuthRequest;
  try {
    const newBook: Book = await bookModel.create({
      title,
      author: _req.userId as string || author,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const { title, genre } = req.body;
  // Validation
  if (!title && !genre && !req.files) {
    const error = createHttpError(400, "At least one field is required to update");
    return next(error);
  }
  // Database operations
  let book: Book | null;
  try {
    book = await bookModel.findById(bookId);
    if (!book) {
      const error = createHttpError(404, "Book not found");
      return next(error);
    }
  } catch (error) {
    console.error("Error fetching book from database:", error);
    const httpError = createHttpError(500, "Error occurred while fetching book");
    return next(httpError);
  }
  // Validation
  if (book.author._id.toString() !== (req as AuthRequest).userId) {
    const error = createHttpError(403, "You are not authorized to update this book");
    return next(error);
  }
  // Cover image upload
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageFile = files.coverImage?.[0];
  let uploadCoverImage = "";
  let filePath = "";
  if (coverImageFile) {
    if (!files || !coverImageFile) {
      return res.status(400).json({ error: "Cover image is required" });
    }
    const fileName = coverImageFile?.filename;
    filePath = path.join(process.cwd(), "public/data/uploads", fileName);
    const coverImageMimetype = coverImageFile?.mimetype.split("/")[1] as string;
    const displayName = coverImageFile?.originalname;
    try {
      const coverImage = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "cover_images",
        format: coverImageMimetype,
        display_name: displayName
      });
      uploadCoverImage = coverImage.secure_url;
      // Remove temporary file after public folder
      try {
        await unlink(filePath);
      } catch (error) {
        console.error("Error deleting cover image file:", error);
        const httpError = createHttpError(500, "Error occurred while deleting cover image file");
        return next(httpError);
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
      const httpError = createHttpError(500, "Error occurred while uploading cover image");
      return next(httpError);
    }
  }
  // Book file upload
  const bookFile = files.file?.[0];
  let uploadBookFile = "";
  let bookFilePath = "";
  if (bookFile) {
    if (!files || !bookFile) {
      return res.status(400).json({ error: "Book file is required" });
    }
    const bookFileName = bookFile?.filename;
    bookFilePath = path.join(process.cwd(), "public/data/uploads", bookFileName);
    const bookFileMimetype = bookFile?.mimetype.split("/")[1] as string;
    const bookDisplayName = bookFile?.originalname;
    try {
      const bookFile = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book_pdfs",
        format: bookFileMimetype,
        display_name: bookDisplayName
      });
      uploadBookFile = bookFile.secure_url;
      // Remove temporary files after public folder
      try {
        await unlink(bookFilePath);
      } catch (error) {
        console.error("Error deleting book file:", error);
        const httpError = createHttpError(500, "Error occurred while deleting book file");
        return next(httpError);
      }
    } catch (error) {
      console.error("Error uploading book file:", error);
      const httpError = createHttpError(500, "Error occurred while uploading book file");
      return next(httpError);
    }
  }
  // Database operations
  try {
    const updateBook = await bookModel.findByIdAndUpdate(
      bookId,
      {
        title,
        author: (req as AuthRequest).userId as string || book.author._id.toString(),
        genre,
        coverImage: uploadCoverImage ? uploadCoverImage : book.coverImage,
        file: uploadBookFile ? uploadBookFile : book.file
      },
      { returnDocument: "after" }
    );
    // Response
    res.json({ id: updateBook?._id, message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book in database:", error);
    const httpError = createHttpError(500, "Error occurred while updating book");
    return next(httpError);
  }
}

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    const httpError = createHttpError(500, "Error occurred while fetching books");
    return next(httpError);
  }
}

const singleBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.findById(req.params.bookId);
    if (!book) {
      const httpError = createHttpError(404, "Book not found");
      return next(httpError);
    }
    res.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    const httpError = createHttpError(500, "Error occurred while fetching book");
    return next(httpError);
  }
}

export { createBook, updateBook, listBooks, singleBook };
