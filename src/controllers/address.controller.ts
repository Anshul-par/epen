import { Response } from "express";
import { Request } from "../types/request.types";
import {
  createAddressService,
  deleteAddressService,
  deleteDefaultAddressService,
  findAddressService,
  findDefaultAddressService,
  setDefaultAddressService,
  updateAddessService,
} from "../services/address.service";
import { StatusCodes } from "http-status-codes";

export const addAddressController = async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.authUser._id.toString();

  const isThisTheFirstAddress = await findAddressService({
    query: { user: userId },
  });

  const address = await createAddressService({
    ...payload,
    user: userId,
  });

  if (!isThisTheFirstAddress.length || payload.default) {
    // If this is the first address, make it default
    await setDefaultAddressService({
      addressId: address._id.toString(),
      user: userId,
    });
  }

  return res.status(StatusCodes.CREATED).json({
    message: "Address added successfully",
    data: address,
    success: true,
  });
};

export const getAddressesController = async (req: Request, res: Response) => {
  const userId = req.authUser._id.toString();

  const defaultAdress = await findDefaultAddressService({
    user: userId,
  });

  const addresses = await findAddressService({
    query: { user: userId },
  });

  return res.status(StatusCodes.OK).json({
    message: "Addresses fetched successfully",
    data: addresses.map((address) => ({
      ...address,
      default: defaultAdress?.address?.toString() === address._id.toString(),
    })),
    success: true,
  });
};

export const getSingleAddressController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.authUser._id.toString();

  const address = await findAddressService({
    query: { _id: id, user: userId },
  });

  if (!address.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Address not found",
      success: false,
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "Address fetched successfully",
    data: address,
    success: true,
  });
};

export const updateAddressController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser._id.toString();
  const payload = req.body;

  const query = { _id: id, user: userId };

  const address = await findAddressService({
    query,
  });

  if (!address.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Address not found",
      success: false,
    });
  }

  const updatedAddress = await updateAddessService({
    query,
    updates: payload,
  });

  if (payload.default) {
    await setDefaultAddressService({
      user: userId,
      addressId: id,
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "Address updated successfully",
    data: updatedAddress,
    success: true,
  });
};

export const deleteAddressController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser._id.toString();

  const query = { _id: id, user: userId };

  const address = await findAddressService({
    query,
  });

  if (!address.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Address not found",
      success: false,
    });
  }

  const isTheCurrentDefault = await findDefaultAddressService({
    addressId: id,
    user: userId,
  });

  if (isTheCurrentDefault) {
    await deleteDefaultAddressService({
      user: userId,
      addressId: id,
    });
  }

  await deleteAddressService({
    query,
  });

  return res.status(StatusCodes.OK).json({
    message: "Address deleted successfully",
    success: true,
  });
};
