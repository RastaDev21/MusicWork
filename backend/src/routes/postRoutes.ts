import { Router } from "express";
import PostController from "../controllers/PostController";
import { authMiddleware } from "../middlewares/authMiddleware";

const postRouter = Router();

postRouter.post("/posts", authMiddleware, PostController.create);
postRouter.get("/posts", authMiddleware, PostController.list);

export default postRouter;
