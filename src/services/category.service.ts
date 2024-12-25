import { FilterQuery } from "mongoose";
import { CategoryModel } from "../models/category.model";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { ICategory } from "../types/model.types";

export const getCategoryService = async ({
  query,
  populuate = [],
}: {
  query: FilterQuery<ICategory>;
  populuate?: { path: string; select: string }[];
}) => {
  try {
    const c = await CategoryModel.find(query).populate(populuate).lean();
    return c;
  } catch (error) {
    console.log("error in getCategoryService", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createCategoryService = async (payload: ICategory) => {
  try {
    const c = await CategoryModel.create(payload);
    return c;
  } catch (error) {
    console.log("error in createCategoryService", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateCategoryService = async ({
  query,
  update,
}: {
  query: FilterQuery<ICategory>;
  update: ICategory;
}) => {
  try {
    const c = await CategoryModel.findOneAndUpdate(query, update, {
      new: true,
    }).lean();

    return c;
  } catch (error) {
    console.log("error in updateCategoryService", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteCategoryService = async ({
  query,
}: {
  query: FilterQuery<ICategory>;
}) => {
  try {
    const c = await CategoryModel.findOneAndDelete(query).lean();
    return c;
  } catch (error) {
    console.log("error in deleteCategoryService", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
