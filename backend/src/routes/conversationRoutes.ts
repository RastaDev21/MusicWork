import { Router } from "express";
import ConversationController from "../controllers/ConversationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const conversationRouter = Router();

conversationRouter.post(
  "/conversations",
  authMiddleware,
  ConversationController.start,
);
conversationRouter.get(
  "/conversations",
  authMiddleware,
  ConversationController.list,
);
conversationRouter.get(
  "/conversations/unread-count",
  authMiddleware,
  ConversationController.unreadCount,
);
conversationRouter.get(
  "/conversations/:id/messages",
  authMiddleware,
  ConversationController.getMessages,
);
conversationRouter.post(
  "/conversations/:id/messages",
  authMiddleware,
  ConversationController.sendMessage,
);
conversationRouter.post(
  "/conversations/support",
  authMiddleware,
  ConversationController.startSupport,
);

export default conversationRouter;
