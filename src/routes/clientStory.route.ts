import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { validateCreateClientStory } from "../validators/clientStory.validate";
import {
  createClientStoryController,
  getClientStoryController,
  getClientStorySuggestionsController,
  updateClientStoryController,
} from "../controllers/clientStory.controller";
import { valiadteParamId } from "../validators/custom.validate";

export const clientStoryRouter = express.Router();

clientStoryRouter.get(
  "/suggestions/:id",
  validateReqSchema(valiadteParamId),
  getClientStorySuggestionsController
);

clientStoryRouter.post(
  "/",
  validateJWT({}),
  validateReqSchema(validateCreateClientStory),
  validateIsAdmin,
  createClientStoryController
);

clientStoryRouter.patch(
  "/:id",
  validateJWT({}),
  validateReqSchema(validateCreateClientStory),
  validateIsAdmin,
  updateClientStoryController
);

clientStoryRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getClientStoryController
);

// mongodb+srv://parnetwork03:FDpTIkjSws24neHg@genxi.tiaymzj.mongodb.net/chat_hub
// mongodb+srv://parHome:xizH7ZTgAXaGvh1T@par-homeproduct.kf9jprm.mongodb.net/
// mongodb+srv://Par-Client:iGUtdxXc58pegBuF@cluster0.uapdrwt.mongodb.net/emergency?retryWrites=true&w=majority
