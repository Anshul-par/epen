import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateProductDetails,
  validateUpdateProductDetails,
} from "../validators/productDetails.validate";
import {
  createProductDetailsController,
  getProductDetailsController,
  updateProductDetailsController,
} from "../controllers/productDetails.controller";
import { valiadteParamId } from "../validators/custom.validate";
const productDetailsRouter = express.Router();

productDetailsRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateCreateProductDetails),
  createProductDetailsController
);

productDetailsRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateUpdateProductDetails),
  updateProductDetailsController
);

productDetailsRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getProductDetailsController
);

export { productDetailsRouter };
