import { Router } from "express";
import FollowController from "../controllers/FollowController";
import { authMiddleware } from "../middlewares/authMiddleware";

const followRouter = Router();

followRouter.post("/follows/:id", authMiddleware, FollowController.toggle);
followRouter.get("/follows/:id", authMiddleware, FollowController.status);

export default followRouter;
