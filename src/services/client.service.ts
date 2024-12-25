import { StatusCodes } from "http-status-codes";
import { IClient } from "../types/model.types";
import { APIError } from "../errors/apiError";
import { ClientModel } from "../models/client.model";
import { FilterQuery } from "mongoose";
import { ClientStoryModel } from "../models/clientstory.model";

export const createClientService = async (
  client: IClient
): Promise<IClient> => {
  try {
    const c = await ClientModel.create(client);
    const populated_c = await ClientModel.findById(c._id)
      .populate("image")
      .lean();

    return populated_c;
  } catch (error) {
    console.log("Error while creating client", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findClientService = async ({
  query,
  populate = [],
  isAdminRequested = false,
}: {
  query: FilterQuery<IClient>;
  populate?: string[];
  isAdminRequested?: boolean;
}) => {
  try {
    const c = await ClientModel.find(query)
      .populate(populate)
      .sort({ createdAt: -1 })
      .lean();
    const data = [];

    if (!c || !c.length || !isAdminRequested) {
      return c;
    }

    for (const client of c) {
      const story = await ClientStoryModel.findOne({ client: client._id })
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

      if (story) {
        //@ts-ignore
        client.story = story;
      }
      data.push(client);
    }
    return data;
  } catch (error) {
    console.log("Error while finding client", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
export const updateClientService = async ({
  query,
  update,
}: {
  query: FilterQuery<IClient>;
  update: Partial<IClient>;
}) => {
  try {
    const c = await ClientModel.findOneAndUpdate(
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
      .lean();

    return c;
  } catch (error) {
    console.log("Error while updating client", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteClientService = async (query: Partial<IClient>) => {
  try {
    const c = await ClientModel.findOneAndDelete(query).lean();
    return c;
  } catch (error) {
    console.log("Error while deleting client", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
