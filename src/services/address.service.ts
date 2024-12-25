import { StatusCodes } from "http-status-codes";
import { AddressModel } from "../models/address.model";
import { IAddress } from "../types/model.types";
import { APIError } from "../errors/apiError";
import { FilterQuery } from "mongoose";
import { DefaultAddressModel } from "../models/defaultAddress.model";

export const createAddressService = async (addressData: IAddress) => {
  try {
    const address = await AddressModel.create(addressData);
    return address;
  } catch (error) {
    console.log("Error while creating address", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findAddressService = async ({
  query,
  populate = [],
}: {
  query: FilterQuery<IAddress>;
  populate?: string[];
}) => {
  try {
    const a = await AddressModel.find(query)
      .populate(populate)
      .sort({
        createdAt: -1,
      })
      .lean();
    return a;
  } catch (error) {
    console.log("Error while finding address", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateAddessService = async ({
  query,
  updates,
}: {
  query: FilterQuery<IAddress>;
  updates: Partial<IAddress>;
}) => {
  try {
    const a = await AddressModel.findOneAndUpdate(query, updates, {
      new: true,
    }).lean();

    return a;
  } catch (error) {
    console.log("Error while updating address", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteAddressService = async ({
  query,
}: {
  query: FilterQuery<IAddress>;
}) => {
  try {
    const a = await AddressModel.findOneAndDelete(query).lean();
    return a;
  } catch (error) {
    console.log("Error while deleting address", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const setDefaultAddressService = async ({
  user,
  addressId,
}: {
  user: string;
  addressId: string;
}) => {
  try {
    const defaultAddress = await DefaultAddressModel.findOneAndUpdate(
      {
        user,
      },
      {
        address: addressId,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return defaultAddress;
  } catch (error) {
    console.log("Error while making address default", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteDefaultAddressService = async ({
  user,
  addressId,
}: {
  user: string;
  addressId: string;
}) => {
  try {
    const defaultAddress = await DefaultAddressModel.findOneAndDelete({
      user,
      address: addressId,
    });

    return defaultAddress;
  } catch (error) {
    console.log("Error while making address default", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findDefaultAddressService = async ({
  user,
  addressId,
}: {
  user: string;
  addressId?: string;
}) => {
  try {
    const defaultAddress = await DefaultAddressModel.findOne({
      user,
      ...(addressId && { address: addressId }),
    });

    return defaultAddress;
  } catch (error) {
    console.log("Error while making address default", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
