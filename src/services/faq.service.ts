import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";
import { FAQModel } from "../models/faq.model";
import { IFAQ } from "../types/model.types";
import { FilterQuery } from "mongoose";

export const createFAQInDB = async (faq: IFAQ) => {
  try {
    const f = await FAQModel.create(faq);
    return f.toObject();
  } catch (error) {
    console.log("Error while creating FAQ", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findFAQInDB = async ({ query }: { query: FilterQuery<IFAQ> }) => {
  try {
    const f = await FAQModel.find(query)
      .sort({
        createdAt: -1,
      })
      .lean();

    return f;
  } catch (error) {
    console.log("Error while finding FAQ", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateFAQInDB = async ({
  query,
  update,
}: {
  query: FilterQuery<IFAQ>;
  update: Partial<IFAQ>;
}) => {
  try {
    const f = await FAQModel.findOneAndUpdate(query, update, {
      new: true,
    }).lean();
    return f;
  } catch (error) {
    console.log("Error while updating FAQ", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteFAQInDB = async ({
  query,
}: {
  query: FilterQuery<IFAQ>;
}) => {
  try {
    const f = await FAQModel.findOneAndDelete(query).lean();
    return f;
  } catch (error) {
    console.log("Error while deleting FAQ", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
