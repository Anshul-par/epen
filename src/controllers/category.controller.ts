import { Response } from "express";
import { Request } from "../types/request.types";
import { StatusCodes } from "http-status-codes";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryService,
  updateCategoryService,
} from "../services/category.service";

export const getAllCategoryController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";

  const data = await getCategoryService({
    query: {
      ...(isAdminRequested ? {} : { hidden: false }),
    },
  });

  return res.status(StatusCodes.OK).json({
    data,
    success: true,
  });
};

export const getSingleCategoryController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const data = await getCategoryService({
    query: { _id: id },
  });

  if (!data.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Category not found",
      success: false,
    });
  }

  return res.status(StatusCodes.OK).json({
    data,
    success: true,
  });
};

export const createCategoryController = async (req: Request, res: Response) => {
  const payload = req.body;
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);

  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      url,
      _id,
      mime: file.mimetype,
      title: file.originalname,
      description: "",
    });

    payload.image = media._id;
  }

  if (payload.icon_image) {
    const { _id, url } = await uploadMediaToS3(
      payload.icon_image.buffer,
      payload.icon_image.mimetype
    );
    const media = await saveMediaInDB({
      url,
      _id,
      mime: payload.icon_image.mimetype,
      title: payload.icon_image.originalname,
      description: "",
    });

    payload.icon_image = media._id;
  }

  const data = await createCategoryService({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    data,
    success: true,
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.image = media._id;
  }

  const data = await updateCategoryService({
    query: { _id: id },
    update: payload,
  });

  return res.status(StatusCodes.OK).json({
    data,
    success: true,
  });
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await deleteCategoryService({
    query: { _id: id },
  });

  return res.status(StatusCodes.OK).json({
    data,
    success: true,
  });
};
