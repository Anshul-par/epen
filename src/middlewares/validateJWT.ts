import { NextFunction, Response } from "express";
import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utility/genJWT";
import { findUser } from "../services/user.service";
import { Request } from "../types/request.types";

export const validateJWT =
  ({ throwErrorToMiddleware = true }: { throwErrorToMiddleware?: boolean }) =>
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.header("Authorization");

    if (!token && throwErrorToMiddleware) {
      throw new APIError(
        StatusCodes.UNAUTHORIZED,
        "Token Not Found. Unauthorized Request. Login Again"
      );
    }

    let decode: any;
    try {
      decode = verifyJWT(token);
    } catch (error) {
      if (throwErrorToMiddleware) {
        console.log("Error in verifying token", error);
        throw new APIError(
          StatusCodes.UNAUTHORIZED,
          "Token is Expired. Login Again"
        );
      }
    }

    const user = await findUser({ query: { _id: decode?.id } });

    if (!user && throwErrorToMiddleware) {
      throw new APIError(StatusCodes.UNAUTHORIZED, "Unauthorized Request.");
    }

    // ATTACH USER OBJECT IN REQ OBJECT FOR FURTHER USE IN CONTROLLERS
    req.authUser = user;

    // ATTACH ADMIN FLAG IN REQ OBJECT FOR FURTHER USE IN CONTROLLERS
    req.admin = user?.role === "ADMIN";

    next();
  };
