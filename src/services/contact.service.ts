import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";
import { ContactModel } from "../models/contact.model";
import { IContact } from "../types/model.types";
import { FilterQuery } from "mongoose";

export const updateContactToDB = async ({
  query,
  update,
}: {
  query: FilterQuery<IContact>;
  update: Partial<IContact>;
}) => {
  try {
    const c = await ContactModel.findOneAndUpdate(query, update, {
      new: true,
    }).lean();
    return c;
  } catch (error) {
    console.log("Error while updating contact to DB", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const saveContactToDB = async (payload: IContact) => {
  try {
    const c = await ContactModel.create(payload);
    return c.toObject();
  } catch (error) {
    console.log("Error while saving contact to DB", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findContactService = async ({
  query,
  populate = [],
}: {
  query: FilterQuery<IContact>;
  populate?: string[];
}) => {
  try {
    const c = await ContactModel.find({
      ...query,
    })
      .populate(populate)
      .populate("media")
      .lean();
    return c;
  } catch (error) {
    console.log("Error while finding contact", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
