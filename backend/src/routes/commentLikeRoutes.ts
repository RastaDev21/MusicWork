import { Router } from "express";
import CommentLikeController from "../controllers/CommentLikeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const commentLikeRouter = Router();

commentLikeRouter.post(
  "/comment-likes/:commentId",
  authMiddleware,
  CommentLikeController.toggle,
);

export default commentLikeRouter;
