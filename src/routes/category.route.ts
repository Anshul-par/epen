import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from "../controllers/category.controller";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { filesUpload } from "../middlewares/fileupload";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/category.validate";
import { valiadteParamId } from "../validators/custom.validate";

const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  validateJWT({ throwErrorToMiddleware: false }),
  getAllCategoryController
);
categoryRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getSingleCategoryController
);

categoryRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateCreateCategory),
  createCategoryController
);
categoryRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateUpdateCategory),
  updateCategoryController
);
categoryRouter.delete(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteCategoryController
);

export { categoryRouter };
