import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);
authRouter.post("/verify-email", AuthController.verifyEmail);
authRouter.post("/google", AuthController.googleLogin);
authRouter.post(
  "/resend-verification",
  authMiddleware,
  AuthController.resendVerification,
);
authRouter.put("/account/email", authMiddleware, AuthController.changeEmail);
authRouter.put(
  "/account/password",
  authMiddleware,
  AuthController.changePassword,
);

export default authRouter;
