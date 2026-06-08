import { Router } from "express";
import { LikeController } from "../controllers/LikeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post("/likes/:postId", authMiddleware, likeController.toggle);

export default likeRouter;
