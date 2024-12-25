import { ProductModel } from "../models/product.model";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";
import { IProduct } from "../types/model.types";
import { FilterQuery } from "mongoose";
import { ProductDetailModel } from "../models/productDetails.model";

export const findProductService = async ({
  query,
  populate = [],
  isAdminRequested = false,
}: {
  query: FilterQuery<IProduct>;
  populate?: { path: string; select: string }[];
  isAdminRequested?: boolean;
}) => {
  try {
    const p = await ProductModel.find({ ...query })
      .populate(populate)
      .sort({
        createdAt: -1,
      })
      .lean();

    const data = [];

    if (!p || !p.length || !isAdminRequested) {
      return p;
    }

    for (const product of p) {
      const details = await ProductDetailModel.findOne({ product: product._id })
        .populate({
          path: "components.image",
        })
        .populate({
          path: "components.bgImage",
        })
        .populate({
          path: "icon_image",
        })
        .lean();

      if (details) {
        //@ts-ignore
        product.details = details;
      }
      data.push(product);
    }

    return data;
  } catch (error) {
    console.log("Error while finding product", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createProductService = async (product: IProduct) => {
  try {
    const p = await ProductModel.create(product);

    return p.toObject();
  } catch (error) {
    console.log("Error while creating product", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateProductService = async ({
  query,
  update,
}: {
  query: FilterQuery<IProduct>;
  update: Partial<IProduct>;
}) => {
  try {
    const p = await ProductModel.findOneAndUpdate(
      {
        ...query,
      },
      {
        ...update,
      },
      {
        new: true,
      }
    )
      .populate("image")
      .populate("category")
      .lean();

    return p;
  } catch (error) {
    console.log("Error while updating product", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteProductService = async (product_id: string) => {
  try {
    const p = await ProductModel.findByIdAndDelete(product_id).lean();
    return p;
  } catch (error) {
    console.log("Error while deleting product", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
