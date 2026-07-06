import { Request, Response } from "express";
import CommentLike from "../models/CommentLike";
import Comment from "../models/Comment";
import NotificationService from "../services/NotificationService";

export class CommentLikeController {
  async toggle(req: Request, res: Response) {
    try {
      const userId = req.headers["userId"] as string;
      const { commentId } = req.params;

      const existingLike = await CommentLike.findOne({
        where: { userId, commentId },
      });

      if (existingLike) {
        await existingLike.destroy();
        return res.json({ liked: false });
      } else {
        await CommentLike.create({ userId, commentId });

        const comment = await Comment.findByPk(commentId);
        if (comment) {
          await NotificationService.create(
            comment.userId,
            userId,
            "comment_like",
            comment.postId,
          );
        }

        return res.json({ liked: true });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao curtir comentário!" });
    }
  }
}

export default new CommentLikeController();
