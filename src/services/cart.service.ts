import { FilterQuery } from "mongoose";
import { ICart } from "../types/model.types";
import { CartModel } from "../models/cart.model";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";

export const createCart = async ({ userId }: { userId: string }) => {
  try {
    const cart = await CartModel.create({ user: userId, items: [] });
    return cart;
  } catch (error: any) {
    console.log("Error while creating cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const findCart = async ({
  query,
  populate = [],
}: {
  query: FilterQuery<ICart>;
  populate?: string[];
}) => {
  try {
    const cart = await CartModel.find(query).populate(populate).lean();
    return cart;
  } catch (error: any) {
    console.log("Error while finding cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  try {
    const cart = await CartModel.findOneAndUpdate(
      { user: userId, status: "active" },
      {
        $push: {
          items: { productId, quantity },
        },
      },
      { new: true, upsert: true }
    );
    return cart;
  } catch (error: any) {
    console.log("Error while adding item to cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateCartItem = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  try {
    const cart = await CartModel.findOneAndUpdate(
      {
        user: userId,
        "items.productId": productId,
        status: "active",
      },
      {
        $set: {
          "items.$.quantity": quantity,
        },
      },
      { new: true }
    );
    return cart;
  } catch (error: any) {
    console.log("Error while updating cart item", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const removeItemFromCart = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  try {
    const cart = await CartModel.findOneAndUpdate(
      { user: userId, status: "active" },
      {
        $pull: {
          items: { productId },
        },
      },
      { new: true }
    );
    return cart;
  } catch (error: any) {
    console.log("Error while removing item from cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const clearCart = async ({
  userId,
  cartId,
}: {
  userId: string;
  cartId: string;
}) => {
  try {
    const cart = await CartModel.findOneAndUpdate(
      { _id: cartId, user: userId, status: "active" },
      {
        $set: { items: [] },
      },
      { new: true }
    );
    return cart;
  } catch (error: any) {
    console.log("Error while clearing cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteCart = async ({ userId }: { userId: string }) => {
  try {
    await CartModel.findOneAndDelete({ user: userId, status: "active" });
  } catch (error: any) {
    console.log("Error while deleting cart", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
