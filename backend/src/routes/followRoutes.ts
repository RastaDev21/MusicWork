import { Router } from "express";
import FollowController from "../controllers/FollowController";
import { authMiddleware } from "../middlewares/authMiddleware";

const followRouter = Router();

followRouter.post("/follows/:id", authMiddleware, FollowController.toggle);
followRouter.put("/follows/:id", authMiddleware, FollowController.follow);
followRouter.get("/follows/:id", authMiddleware, FollowController.status);
followRouter.get(
  "/follows/:id/followers",
  authMiddleware,
  FollowController.followers,
);
followRouter.get(
  "/follows/:id/following",
  authMiddleware,
  FollowController.following,
);

export default followRouter;
