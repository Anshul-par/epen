import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import { validateCreatePage } from "../validators/page.validate";
import {
  // addPageSectionController,
  createPageController,
  deletePageController,
  // deletePageSectionController,
  getSinglePageController,
  updatePageController,
  // updatePageSectionController,
} from "../controllers/page.controller";

const pageRouter = express.Router();

pageRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateCreatePage),
  createPageController
);
pageRouter.patch(
  "/:name",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateCreatePage),
  updatePageController
);
pageRouter.get("/:name", getSinglePageController);
pageRouter.delete("/:name", validateJWT({}), deletePageController);

// pageRouter.post("section/:name", validateJWT({}), addPageSectionController);
// pageRouter.patch(
//   "section/:name/:sectionId",
//   validateJWT({}),
//   validateIsAdmin,
//   updatePageSectionController
// );
// pageRouter.delete(
//   "section/:name/:sectionId",
//   validateJWT({}),
//   validateIsAdmin,
//   deletePageSectionController
// );

export { pageRouter };
