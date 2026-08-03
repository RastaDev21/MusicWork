import { Request, Response } from "express";
import Like from "../models/Like";
import Post from "../models/Post";
import NotificationService from "../services/NotificationService";

export class LikeController {
  async toggle(req: Request, res: Response) {
    try {
      const userId = req.userId as string;
      const { postId } = req.params;

      const existingLike = await Like.findOne({
        where: { userId, postId },
      });

      if (existingLike) {
        await existingLike.destroy();
        return res.json({ liked: false });
      } else {
        await Like.create({ userId, postId });

        const post = await Post.findByPk(postId as string);
        if (post) {
          await NotificationService.create(
            post.userId,
            userId as string,
            "like",
            postId as string,
          );
        }

        return res.json({ liked: true });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao curtir post!" });
    }
  }
}
