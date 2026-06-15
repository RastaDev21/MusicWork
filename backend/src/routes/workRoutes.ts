import { Router } from "express";
import WorkController from "../controllers/WorkController";
import { authMiddleware } from "../middlewares/authMiddleware";

const workRouter = Router();

workRouter.post("/works", authMiddleware, WorkController.create);
workRouter.get("/works", authMiddleware, WorkController.list);
workRouter.delete("/works/:id", authMiddleware, WorkController.delete);
workRouter.put("/works/:id", authMiddleware, WorkController.update);

export default workRouter;
