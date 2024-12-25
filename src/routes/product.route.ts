import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  updateProductController,
} from "../controllers/product.controller";
import { valiadteParamId } from "../validators/custom.validate";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateVideoPlugin,
  validateUpdateVideoPlugin,
} from "../validators/product.validate";
import { filesUpload } from "../middlewares/fileupload";

const productRouter = express.Router();

productRouter.get(
  "/",
  validateJWT({ throwErrorToMiddleware: false }),
  getProductsController
);
productRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getSingleProductController
);

productRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateCreateVideoPlugin),
  createProductController
);
productRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  // validateReqSchema(validateUpdateVideoPlugin),
  updateProductController
);
productRouter.delete(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteProductController
);

export { productRouter };
