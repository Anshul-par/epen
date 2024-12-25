import express, { Request, Response } from "express";
import { filesUpload } from "../middlewares/fileupload";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { StatusCodes } from "http-status-codes";

const mediaRouter = express.Router();

mediaRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  async (req: Request, res: Response) => {
    try {
      const file = Array.isArray(req.files)
        ? req.files?.[0]
        : (req.files?.["file"]?.[0] as Express.Multer.File);

      if (file) {
        const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
        const media = await saveMediaInDB({
          mime: file.mimetype,
          description: "",
          url: url,
          title: file.originalname,
          _id: _id,
        });
        return res.status(StatusCodes.CREATED).json({
          message: "Media uploaded successfully",
          data: media,
          success: true,
        });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error, cannot upload media",
        success: false,
      });
    }
  }
);

export { mediaRouter };
