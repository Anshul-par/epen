import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});

export const filesUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define the fields
  const uploadFields = upload.fields([
    { name: "file", maxCount: 10 }, // Up to 10 files in "file" field
    { name: "icon_image", maxCount: 1 }, // Single file in "icon_image" field
  ]);

  // Process the request
  uploadFields(req, res, (err) => {
    console.log("---------- File-Upload Middleware Started ----------");

    if (err && err instanceof MulterError) {
      console.log("Multer Error in FileUpload Middleware", err);
      return next(
        new APIError(
          StatusCodes.BAD_REQUEST,
          `The error happened in ${err.field} field. Server expects media in the respective field. Reason: ${err.message}:${err.name}`
        )
      );
    }

    if (err) {
      return next(new APIError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }

    // Attach files to `req.body`
    req.body = req.body || {};
    req.body.files = Array.isArray(req.files) ? [] : req.files?.file || []; // Array of files in "file" field
    //@ts-ignore
    if (req.files?.icon_image) {
      req.body.icon_image =
        (req.files as { [fieldname: string]: Express.Multer.File[] })
          ?.icon_image?.[0] || null; // Single file in "icon_image" field
    }

    console.log("Uploaded files:", req.body.files);
    console.log("Uploaded icon image:", req.body.icon_image);

    console.log("---------- File-Upload Middleware End ----------");

    next();
  });
};
