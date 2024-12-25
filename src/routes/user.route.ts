import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import {
  getUserInfoController,
  renderPasswordResetPageController,
  resetPasswordController,
  sendPasswordResetMailController,
  updateUserController,
  updateUserMailController,
  verifyUserController,
  updatePasswordController,
} from "../controllers/user.controller";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateUpdateUser,
  validateUpdateUserMail,
} from "../validators/user.validate";
const userRouter = express.Router();

// GENREL USER ROUTES
userRouter.get("/", validateJWT({}), getUserInfoController);
userRouter.post("/verify", verifyUserController);
userRouter.patch(
  "/",
  validateJWT({}),
  validateReqSchema(validateUpdateUser),
  updateUserController
);
userRouter.patch(
  "/update-mail",
  validateJWT({}),
  validateReqSchema(validateUpdateUserMail),
  updateUserMailController
);

// RESET PASSWORD ROUTES
userRouter.get(
  "/password-reset-mail",
  validateJWT({}),
  sendPasswordResetMailController
);
userRouter.get("/password-reset", renderPasswordResetPageController);
userRouter.post("/password-reset", resetPasswordController);
userRouter.patch("/update-password", validateJWT({}), updatePasswordController);

export { userRouter };
