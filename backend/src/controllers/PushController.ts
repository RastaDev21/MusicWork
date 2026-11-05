import { Request, Response } from "express";
import PushService from "../services/PushService";

class PushController {
  async publicKey(request: Request, response: Response) {
    return response.status(200).json({ publicKey: PushService.getPublicKey() });
  }

  async subscribe(request: Request, response: Response) {
    try {
      const userId = request.userId as string;
      const result = await PushService.subscribe(userId, request.body);
      return response.status(201).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async unsubscribe(request: Request, response: Response) {
    try {
      const userId = request.userId as string;
      const result = await PushService.unsubscribe(
        userId,
        request.body?.endpoint,
      );
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new PushController();
