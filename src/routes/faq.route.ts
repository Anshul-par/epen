import express from "express";
import {
  createFAQController,
  deleteFAQController,
  getFAQsController,
  getSingleFAQController,
  updateFAQController,
} from "../controllers/faq.controller";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateFaq,
  validateUpdateFaq,
} from "../validators/faq.validate";
import { valiadteParamId } from "../validators/custom.validate";

const faqRouter = express.Router();

faqRouter.get(
  "/",
  validateJWT({ throwErrorToMiddleware: false }),
  getFAQsController
);
faqRouter.get(
  "/:id",
  validateReqSchema(valiadteParamId),
  getSingleFAQController
);

faqRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateCreateFaq),
  createFAQController
);
faqRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateUpdateFaq),
  updateFAQController
);
faqRouter.delete(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(valiadteParamId),
  deleteFAQController
);

export { faqRouter };
