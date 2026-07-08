import { Request, Response } from "express";
import ConversationService from "../services/ConversationService";

class ConversationController {
  async start(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const { otherUserId } = request.body;

      const conversation = await ConversationService.findOrCreateConversation(
        userId,
        otherUserId,
      );

      return response.status(200).json(conversation);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const conversations = await ConversationService.listConversations(userId);
      return response.status(200).json(conversations);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async getMessages(request: Request<{ id: string }>, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.headers["userId"] as string;
      const messages = await ConversationService.getMessages(id, userId);
      return response.status(200).json(messages);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async sendMessage(request: Request<{ id: string }>, response: Response) {
    try {
      const { id } = request.params;
      const senderId = request.headers["userId"] as string;
      const { content, imageUrl, videoUrl } = request.body;

      const message = await ConversationService.sendMessage(
        id,
        senderId,
        content,
        imageUrl,
        videoUrl,
      );

      return response.status(201).json(message);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async unreadCount(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const count = await ConversationService.getUnreadCount(userId);
      return response.status(200).json({ count });
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default new ConversationController();
