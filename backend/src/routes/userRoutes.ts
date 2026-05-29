import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.post("/users", UserController.create);
userRouter.get("/profile", authMiddleware, UserController.profile);

export default userRouter;
