import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import {
  addAddressController,
  deleteAddressController,
  getAddressesController,
  getSingleAddressController,
  updateAddressController,
} from "../controllers/address.controller";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateAddress,
  validateUpdateAddress,
} from "../validators/address.validate";
import { valiadteParamId } from "../validators/custom.validate";

const addressRouter = express.Router();

addressRouter.get("/", validateJWT({}), getAddressesController);
addressRouter.get(
  "/:id",
  validateJWT({}),
  validateReqSchema(valiadteParamId),
  getSingleAddressController
);
addressRouter.post(
  "/",
  validateJWT({}),
  validateReqSchema(validateCreateAddress),
  addAddressController
);

addressRouter.patch(
  "/:id",
  validateJWT({}),
  validateReqSchema(validateUpdateAddress),
  updateAddressController
);
addressRouter.delete(
  "/:id",
  validateJWT({}),
  validateReqSchema(valiadteParamId),
  deleteAddressController
);

export { addressRouter };
