import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";

const createBook = async (req: Request, res: Response) => {
  // const { title, author, genre } = req.body;

  console.log("Files received:", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageFile = files.coverImage?.[0];
  if (!files || !coverImageFile) {
    return res.status(400).json({ error: "Cover image is required" });
  }
  const fileName = coverImageFile?.filename;
  const filePath = path.join(process.cwd(), "public/data/uploads", fileName);
  const coverImageMimetype = coverImageFile?.mimetype.split("/")[1] as string;
  const displayName = coverImageFile?.originalname;
  const uploadCoverImage = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "cover_images",
    format: coverImageMimetype,
    display_name: displayName
  });
  console.log("Cloudinary image file upload result:", uploadCoverImage);

  const bookFile = files.file?.[0];
  if (!files || !bookFile) {
    return res.status(400).json({ error: "Book file is required" });
  }
  const bookFileName = bookFile?.filename;
  const bookFilePath = path.join(process.cwd(), "public/data/uploads", bookFileName);
  const bookFileMimetype = bookFile?.mimetype.split("/")[1] as string;
  const bookDisplayName = bookFile?.originalname;
  const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: "raw",
    filename_override: bookFileName,
    folder: "book_pdfs",
    format: bookFileMimetype,
    display_name: bookDisplayName
  });
  console.log("Cloudinary book file upload result:", uploadBookFile);
  res.json({});

};

export { createBook };
