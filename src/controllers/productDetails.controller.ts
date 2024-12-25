import { StatusCodes } from "http-status-codes";
import { Request } from "../types/request.types";
import { Response } from "express";
import { IProductDetails } from "../types/model.types";
import { ProductDetailModel } from "../models/productDetails.model";
import { APIError } from "../errors/apiError";
import { ProductModel } from "../models/product.model";

export const createProductDetailsController = async (
  req: Request,
  res: Response
) => {
  const { components, product, icon_image }: IProductDetails = req.body;

  // Clean Empty Strings from components
  const c = components.map((component) => {
    for (const key in component) {
      if (component.hasOwnProperty(key) && component[key] === "") {
        delete component[key];
      }
    }

    return component;
  });

  const productDetails = await ProductDetailModel.create({
    components: c,
    product,
    ...(icon_image ? { icon_image } : {}),
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Product Details created successfully",
    data: productDetails,
    success: true,
  });
};

export const updateProductDetailsController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { components, product: p, icon_image }: IProductDetails = req.body;

  // Clean Empty Strings from components
  const c = components.map((component) => {
    for (const key in component) {
      if (component.hasOwnProperty(key) && component[key] === "") {
        delete component[key];
      }
    }

    return component;
  });

  const productDetails = await ProductDetailModel.findByIdAndUpdate(
    id,
    {
      components: c,
      product: p,
      ...(icon_image ? { icon_image } : {}),
    },
    {
      new: true,
    }
  )
    .populate("components.image components.bgImage icon_image")
    .lean();

  const product = await ProductModel.findOne({ _id: id })
    .populate("category image icon_image")
    .lean();

  return res.status(StatusCodes.CREATED).json({
    message: "Product details updated successfully",
    data: { ...product, details: productDetails },
    success: true,
  });
};

export const getProductDetailsController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const productDetails = await ProductDetailModel.findOne({
    product: id,
  })
    .populate("product")
    .populate({
      path: "components.image",
    })
    .populate({
      path: "components.bgImage",
    })
    .populate({
      path: "icon_image",
    });

  if (!productDetails) {
    throw new APIError(StatusCodes.NOT_FOUND, "Product Details not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Product Details fetched successfully",
    data: productDetails,
    success: true,
  });
};
