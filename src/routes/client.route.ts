import express from "express";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateClient,
  validateUpdateClient,
} from "../validators/client.validate";
import { valiadteParamId } from "../validators/custom.validate";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import {
  createClientController,
  deleteClientController,
  getClientsController,
  getSingleClientController,
  updateClientController,
} from "../controllers/client.controller";
import { filesUpload } from "../middlewares/fileupload";

const clientRouter = express.Router();

clientRouter.get(
  "/",
  validateJWT({ throwErrorToMiddleware: false }),
  getClientsController
);

clientRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateCreateClient),
  createClientController
);

clientRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getSingleClientController
);
clientRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  filesUpload,
  validateReqSchema(validateUpdateClient),
  updateClientController
);
clientRouter.delete(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteClientController
);

export { clientRouter };
