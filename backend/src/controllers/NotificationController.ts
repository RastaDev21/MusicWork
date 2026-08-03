import { Request, Response } from "express";
import NotificationService from "../services/NotificationService";

class NotificationController {
  async list(request: Request, response: Response) {
    try {
      const recipientId = request.userId as string;
      const notifications = await NotificationService.listByUser(recipientId);
      return response.status(200).json(notifications);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async unreadCount(request: Request, response: Response) {
    try {
      const recipientId = request.userId as string;
      const count = await NotificationService.countUnread(recipientId);
      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async markAllRead(request: Request, response: Response) {
    try {
      const recipientId = request.userId as string;
      const result = await NotificationService.markAllAsRead(recipientId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new NotificationController();
