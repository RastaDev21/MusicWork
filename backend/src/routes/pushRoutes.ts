import { Router } from "express";
import PushController from "../controllers/PushController";
import { authMiddleware } from "../middlewares/authMiddleware";

const pushRouter = Router();

pushRouter.get("/push/public-key", PushController.publicKey);
pushRouter.post("/push/subscription", authMiddleware, PushController.subscribe);
pushRouter.delete(
  "/push/subscription",
  authMiddleware,
  PushController.unsubscribe,
);

export default pushRouter;
