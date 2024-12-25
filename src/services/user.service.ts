import { ClientSession, FilterQuery } from "mongoose";
import { IUser } from "../types/model.types";
import { UserModel } from "../models/user.model";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

export const authenticateUserFromGoogle = async ({
  token,
}: {
  token: string;
}) => {
  try {
    const { data } = await axios.get(`${process.env.GOOGLE_LOGIN}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    console.log("Error while authenticate user with google", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findUser = async ({
  query,
  populate = [],
}: {
  query: FilterQuery<IUser>;
  populate?: string[];
  session?: ClientSession;
}) => {
  try {
    const u = await UserModel.findOne(query, {}).populate(populate).lean();
    return u;
  } catch (error: any) {
    console.log("Error while finding user", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

type UpdateOperators<T> = {
  $set?: Partial<T>;
  $inc?: Partial<Record<keyof T, number>>;
  $push?: Partial<Record<keyof T, any>>;
  $pull?: Partial<Record<keyof T, any>>;
  $unset?: Partial<Record<keyof T, any>>;
};

export const updateUser = async ({
  query,
  update,
}: {
  query: FilterQuery<IUser>;
  update: Partial<IUser> & UpdateOperators<IUser>;
}) => {
  try {
    const u = await UserModel.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
    })
      .select("-password")
      .lean();

    return u;
  } catch (error: any) {
    console.log("Error while updating user", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createUser = async (user: IUser) => {
  try {
    const u = await UserModel.create(user);
    return u;
  } catch (error: any) {
    console.log("Error while creating user", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
