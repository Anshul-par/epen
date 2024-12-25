import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createProductService,
  deleteProductService,
  findProductService,
  updateProductService,
} from "../services/product.service";
import { APIError } from "../errors/apiError";
import { IProduct } from "../types/model.types";
import { getCategoryService } from "../services/category.service";
import { Request } from "../types/request.types";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import { Types } from "mongoose";
import { ProductDetailModel } from "../models/productDetails.model";

export const getProductsController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";
  const products = await findProductService({
    query: {
      ...(isAdminRequested ? {} : { hidden: false }),
    },
    populate: [
      { path: "category", select: "name" },
      { path: "image", select: "url" },
      { path: "icon_image", select: "url" },
    ],
    isAdminRequested,
  });

  return res.status(StatusCodes.OK).json({
    message: "Products fetched successfully",
    data: products,
    success: true,
  });
};

export const getSingleProductController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const product = await findProductService({
    query: { _id: id },
    populate: [
      { path: "category", select: "name" },
      { path: "image", select: "url" },
      { path: "icon_image", select: "url" },
    ],
  });

  if (!product.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "Product not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Product fetched successfully",
    data: product,
    success: true,
  });
};

export const createProductController = async (req: Request, res: Response) => {
  const payload = req.body as IProduct;

  const doesCategoryExist = await getCategoryService({
    query: { _id: payload.category },
  });

  if (!doesCategoryExist.length) {
    throw new APIError(
      StatusCodes.NOT_FOUND,
      "Category not found. Please provide a valid category id"
    );
  }
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);

  let media;
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });
    payload.image = media._id;
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;

    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });
    payload.icon_image = new Types.ObjectId(media._id);
  }

  const product = await createProductService({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Product created successfully",
    data: {
      ...product,
      image: media || product.image,
      category: doesCategoryExist[0],
    },
    success: true,
  });
};

export const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as Partial<IProduct>;

  if (payload.category) {
    const doesCategoryExist = await getCategoryService({
      query: { _id: payload.category },
    });

    if (!doesCategoryExist.length) {
      throw new APIError(
        StatusCodes.NOT_FOUND,
        "Category not found. Please provide a valid category id"
      );
    }
  }

  const product = await findProductService({
    query: { _id: id },
  });

  if (!product.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "Product not found");
  }
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

    payload.image = new Types.ObjectId(media._id);
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.icon_image = new Types.ObjectId(media._id);
  }

  const updatedProduct = await updateProductService({
    query: { _id: id },
    update: payload,
  });

  const productDetails = await ProductDetailModel.findOne({ product: id })
    .populate("components.image components.bgImage icon_image")
    .lean();

  return res.status(StatusCodes.OK).json({
    message: "Product updated successfully",
    data: { ...updatedProduct, details: productDetails },
    success: true,
  });
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await findProductService({
    query: { _id: id },
  });

  if (!product.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "Product not found");
  }

  await deleteProductService(id);

  return res.status(StatusCodes.OK).json({
    message: "Product deleted successfully",
    success: true,
  });
};
