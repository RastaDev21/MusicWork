import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const commentRouter = Router();

commentRouter.post(
  "/posts/:postId/comments",
  authMiddleware,
  CommentController.create,
);
commentRouter.get(
  "/posts/:postId/comments",
  authMiddleware,
  CommentController.list,
);
commentRouter.delete("/comments/:id", authMiddleware, CommentController.delete);

export default commentRouter;
