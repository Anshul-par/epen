import { NextFunction, Response } from "express";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { Request } from "../types/request.types";

export const validateIsAdmin = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const admin = req.admin;

  if (!admin) {
    throw new APIError(StatusCodes.UNAUTHORIZED, "Unauthorized Request.");
  }

  next();
};
