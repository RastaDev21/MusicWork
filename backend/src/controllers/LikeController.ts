import { Request, Response } from "express";
import Like from "../models/Like";

export class LikeController {
  async toggle(req: Request, res: Response) {
    try {
      const userId = req.headers["userId"] || (req.headers["userid"] as string);
      const { postId } = req.params;

      const existingLike = await Like.findOne({
        where: { userId, postId },
      });

      if (existingLike) {
        await existingLike.destroy();
        return res.json({ liked: false });
      } else {
        await Like.create({ userId, postId });
        return res.json({ liked: true });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao curtir post!" });
    }
  }
}
