import { Router } from "express";
import BlockController from "../controllers/BlockController";
import { authMiddleware } from "../middlewares/authMiddleware";

const blockRouter = Router();

blockRouter.get("/blocks", authMiddleware, BlockController.list);
blockRouter.put("/blocks/:id", authMiddleware, BlockController.block);
blockRouter.delete("/blocks/:id", authMiddleware, BlockController.unblock);

export default blockRouter;
