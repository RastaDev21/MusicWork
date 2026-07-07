import { Router } from "express";
import ShowController from "../controllers/ShowController";
import { authMiddleware } from "../middlewares/authMiddleware";

const showRouter = Router();

showRouter.post("/shows", authMiddleware, ShowController.create);
showRouter.get("/shows", authMiddleware, ShowController.list);
showRouter.get(
  "/shows/user/:userId",
  authMiddleware,
  ShowController.listByUser,
);
showRouter.put("/shows/:id", authMiddleware, ShowController.update);
showRouter.delete("/shows/:id", authMiddleware, ShowController.delete);

export default showRouter;
