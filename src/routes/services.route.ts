import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import {
  createServiceController,
  createSubServiceController,
  deleteServiceController,
  deleteSubServiceController,
  getServicesController,
  getSingleServiceController,
  getSingleSubServicesController,
  getSubServicesController,
  updateServiceController,
  updateSubServiceController,
} from "../controllers/services.controller";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateService,
  validateCreateSubService,
  validateUpdateService,
  validateUpdateSubService,
} from "../validators/service.validate";
import { valiadteParamId } from "../validators/custom.validate";
import { filesUpload } from "../middlewares/fileupload";

const servicesRouter = express.Router();

servicesRouter.get(
  "/",
  validateJWT({ throwErrorToMiddleware: false }),
  getServicesController
);
servicesRouter.get(
  "/sub",
  validateJWT({ throwErrorToMiddleware: false }),
  getSubServicesController
);

servicesRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateCreateService),
  createServiceController
);
servicesRouter.post(
  "/sub",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateCreateSubService),
  createSubServiceController
);

servicesRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getSingleServiceController
);
servicesRouter.get(
  "/sub/:id",
  validateReqSchema(valiadteParamId),
  getSingleSubServicesController
);

servicesRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateUpdateService),
  updateServiceController
);
servicesRouter.patch(
  "/sub/:id",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateUpdateSubService),
  updateSubServiceController
);

servicesRouter.delete(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteServiceController
);
servicesRouter.delete(
  "/sub/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteSubServiceController
);

export { servicesRouter };
