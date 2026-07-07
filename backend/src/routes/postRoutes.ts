import { Router } from "express";
import PostController from "../controllers/PostController";
import { authMiddleware } from "../middlewares/authMiddleware";

const postRouter = Router();

postRouter.post("/posts", authMiddleware, PostController.create);
postRouter.get("/posts", authMiddleware, PostController.list);
postRouter.get(
  "/posts/pinned/:userId",
  authMiddleware,
  PostController.getPinned,
);
postRouter.patch("/posts/:id/pin", authMiddleware, PostController.pin);
postRouter.patch("/posts/:id/unpin", authMiddleware, PostController.unpin);
postRouter.delete("/posts/:id", authMiddleware, PostController.delete);

export default postRouter;
