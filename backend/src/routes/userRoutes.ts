import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.post("/users", UserController.create);
userRouter.get("/users/search", authMiddleware, UserController.search);
userRouter.get("/profile", authMiddleware, UserController.profile);
userRouter.put("/users", authMiddleware, UserController.update);

export default userRouter;
