import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validate_add_item,
  validate_create_cart,
  validate_remove_item,
} from "../validators/cart.validate";
import { valiadteParamId } from "../validators/custom.validate";
import {
  addItemToCartController,
  createCartController,
  deleteCartController,
  getCartController,
  removeItemFromCartController,
} from "../controllers/cart.controller";

const cartRouter = express.Router();

cartRouter.post(
  "/create",
  validateJWT({}),
  validateReqSchema(validate_create_cart),
  createCartController
);
cartRouter.get("/", validateJWT({}), getCartController);
cartRouter.patch(
  "/add-item",
  validateJWT({}),
  validateReqSchema(validate_add_item),
  addItemToCartController
);
cartRouter.patch(
  "/remove-item",
  validateJWT({}),
  validateReqSchema(validate_remove_item),
  removeItemFromCartController
);
cartRouter.delete(
  "/delete/:id",
  validateJWT({}),
  validateReqSchema(valiadteParamId),
  deleteCartController
);

export { cartRouter };
