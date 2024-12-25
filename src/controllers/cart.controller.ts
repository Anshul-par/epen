import { Request, Response } from "express";
import { Request as Authrequest } from "../types/request.types";
import {
  addItemToCart,
  clearCart,
  createCart,
  findCart,
  removeItemFromCart,
} from "../services/cart.service";
import { StatusCodes } from "http-status-codes";

export const createCartController = async (req: Authrequest, res: Response) => {
  const user = req?.authUser?._id?.toString();
  const payload = req.body;

  const cart = await createCart({ ...payload, userId: user });

  return res.status(StatusCodes.CREATED).json({
    message: "Cart created successfully",
    data: cart,
    success: true,
  });
};

export const addItemToCartController = async (
  req: Authrequest,
  res: Response
) => {
  const payload = req.body;
  const user = req?.authUser?._id?.toString();

  // if same product is added to cart again, increase the quantity
  const existingCart = await findCart({
    query: {
      userId: user,
      status: "active",
    },
  });

  const cart = await addItemToCart({
    ...payload,
    userId: user,
  });

  return res.status(StatusCodes.OK).json({
    message: "Item added to cart successfully",
    data: cart,
    success: true,
  });
};

export const removeItemFromCartController = async (
  req: Authrequest,
  res: Response
) => {
  const user = req?.authUser?._id?.toString();
  const payload = req.body;

  const cart = await removeItemFromCart({ ...payload, userId: user });

  return res.status(StatusCodes.OK).json({
    message: "Item removed from cart successfully",
    data: cart,
    success: true,
  });
};

export const getCartController = async (req: Authrequest, res: Response) => {
  const user = req?.authUser?._id?.toString();

  let cart = await findCart({
    query: {
      user,
      status: "active",
    },
  });

  if (!cart.length) {
    //@ts-ignore
    cart = await createCart({ userId: user });
  }

  return res.status(StatusCodes.OK).json({
    message: "Cart fetched successfully",
    data: cart,
    success: true,
  });
};

export const deleteCartController = async (req: Authrequest, res: Response) => {
  const user = req?.authUser?._id?.toString();

  await clearCart({ userId: user });

  return res.status(StatusCodes.OK).json({
    message: "Cart cleared successfully",
    success: true,
  });
};
