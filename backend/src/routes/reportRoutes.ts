import { Router } from "express";
import ReportController from "../controllers/ReportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { supportMiddleware } from "../middlewares/supportMiddleware";

const reportRouter = Router();

reportRouter.post("/reports", authMiddleware, ReportController.create);
reportRouter.get(
  "/reports",
  authMiddleware,
  supportMiddleware,
  ReportController.list,
);
reportRouter.get(
  "/reports/count",
  authMiddleware,
  supportMiddleware,
  ReportController.count,
);
reportRouter.post(
  "/reports/:id/resolve",
  authMiddleware,
  supportMiddleware,
  ReportController.resolve,
);

export default reportRouter;
