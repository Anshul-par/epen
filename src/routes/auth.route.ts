import express from "express";
import {
  adminAuthController,
  adminAuthSessionController,
  googleLoginController,
  loginAuthController,
  signUpAuthController,
} from "../controllers/auth.controller";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateAdminLogin,
  validateUserAuth,
} from "../validators/auth.validate";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
const authRouter = express.Router();

authRouter.post(
  "/admin",
  validateReqSchema(validateAdminLogin),
  adminAuthController
);
authRouter.post(
  "/admin/session",
  validateJWT({}),
  validateIsAdmin,
  adminAuthSessionController
);

authRouter.post(
  "/signup",
  validateReqSchema(validateUserAuth),
  signUpAuthController
);

authRouter.post(
  "/login",
  validateReqSchema(validateUserAuth),
  loginAuthController
);

authRouter.post("/google", googleLoginController);

export { authRouter };
