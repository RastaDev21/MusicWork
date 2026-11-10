import { Request, Response } from "express";
import BlockService from "../services/BlockService";

class BlockController {
  async block(request: Request, response: Response) {
    try {
      const blockerId = request.userId as string;
      const blockedId = request.params.id as string;
      const result = await BlockService.block(blockerId, blockedId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async unblock(request: Request, response: Response) {
    try {
      const blockerId = request.userId as string;
      const blockedId = request.params.id as string;
      const result = await BlockService.unblock(blockerId, blockedId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const blockerId = request.userId as string;
      const users = await BlockService.listBlocked(blockerId);
      return response.status(200).json(users);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new BlockController();
