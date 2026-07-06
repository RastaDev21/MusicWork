import { Request, Response } from "express";
import CommentService from "../services/CommentService";

class CommentController {
  async create(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const postId = request.params.postId as string;
      const { content, parentId } = request.body;

      if (!content?.trim()) {
        return response
          .status(400)
          .json({ error: "Comentário não pode ser vazio" });
      }

      const comment = await CommentService.create(
        userId,
        postId,
        content,
        parentId,
      );
      return response.status(201).json(comment);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const postId = request.params.postId as string;
      const userId = request.headers["userId"] as string;
      const comments = await CommentService.listByPost(postId, userId);
      return response.status(200).json(comments);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const commentId = request.params.id as string;
      const result = await CommentService.delete(commentId, userId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new CommentController();
