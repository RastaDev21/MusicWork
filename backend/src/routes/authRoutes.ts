import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

export default authRouter;
