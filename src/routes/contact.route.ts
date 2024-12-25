import express from "express";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { filesUpload } from "../middlewares/fileupload";
import {
  ValidateContactForm,
  ValidateUpdateContactForm,
} from "../validators/contact.validate";
import {
  createContactController,
  getContactsController,
  getSingleContactsController,
  updateContactController,
} from "../controllers/contact.controller";
import { valiadteParamId } from "../validators/custom.validate";

const contactRouter = express.Router();

contactRouter.post(
  "/",
  filesUpload,
  validateReqSchema(ValidateContactForm),
  createContactController
);
contactRouter.patch(
  "/:id",
  filesUpload,
  validateReqSchema(ValidateUpdateContactForm),
  updateContactController
);
contactRouter.get("/", validateJWT({}), validateIsAdmin, getContactsController);
contactRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  validateJWT({}),
  validateIsAdmin,
  getSingleContactsController
);

export { contactRouter };
