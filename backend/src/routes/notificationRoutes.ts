import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificationRouter = Router();

notificationRouter.get(
  "/notifications",
  authMiddleware,
  NotificationController.list,
);
notificationRouter.get(
  "/notifications/unread-count",
  authMiddleware,
  NotificationController.unreadCount,
);
notificationRouter.patch(
  "/notifications/read-all",
  authMiddleware,
  NotificationController.markAllRead,
);

export default notificationRouter;
