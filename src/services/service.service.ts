import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";
import { ServiceModel } from "../models/service.model";
import { IService, ISubService } from "../types/model.types";
import { SubServiceModel } from "../models/subService.model";
import { FilterQuery } from "mongoose";

export const createServiceInDB = async (service: IService) => {
  try {
    const s = await ServiceModel.create(service);
    const populated_s = await ServiceModel.findById(s._id)
      .populate("image")
      .lean();
    return populated_s;
  } catch (error) {
    console.log("Error while creating service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createSubServiceInDB = async (service: ISubService) => {
  try {
    const s = await SubServiceModel.create(service);
    const populated_s = await SubServiceModel.findById(s._id)
      .populate("service")
      .populate("image")
      .lean();
    return populated_s;
  } catch (error) {
    console.log("Error while creating service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findServiceInDB = async ({
  query,
}: {
  query: FilterQuery<IService>;
}) => {
  try {
    const s = await ServiceModel.find(query)
      .sort({
        createdAt: -1,
      })
      .lean();

    return s;
  } catch (error) {
    console.log("Error while finding service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
export const findSubServiceInDB = async ({
  query,
  select = "",
  populate = [],
}: {
  query: FilterQuery<ISubService>;
  select?: string;
  populate?: { path: string; select: string }[];
}) => {
  try {
    let queryBuilder = SubServiceModel.find(query).sort({
      createdAt: -1,
    });

    if (populate.length > 0) {
      queryBuilder = queryBuilder.populate(populate);
    }

    const s = await queryBuilder.lean();
    return s;
  } catch (error) {
    console.log("Error while finding sub-service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateServiceInDB = async ({
  query,
  update,
}: {
  query: FilterQuery<IService>;
  update: Partial<IService>;
}) => {
  try {
    const s = await ServiceModel.findOneAndUpdate(query, update, {
      new: true,
    }).lean();

    return s;
  } catch (error) {
    console.log("Error while updating service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateSubServiceInDB = async ({
  query,
  update,
}: {
  query: FilterQuery<ISubService>;
  update: Partial<ISubService>;
}) => {
  try {
    const s = await SubServiceModel.findOneAndUpdate(query, update, {
      new: true,
    })
      .populate("service")
      .populate("image")
      .lean();

    return s;
  } catch (error) {
    console.log("Error while updating sub-service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteServiceInDB = async ({
  query,
}: {
  query: FilterQuery<IService>;
}) => {
  try {
    const s = await ServiceModel.findOneAndDelete(query).lean();
    return s;
  } catch (error) {
    console.log("Error while deleting service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteSubServiceInDB = async ({
  query,
}: {
  query: FilterQuery<ISubService>;
}) => {
  try {
    const s = await SubServiceModel.findOneAndDelete(query).lean();
    return s;
  } catch (error) {
    console.log("Error while deleting sub service", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
