import { Request, Response } from "express";
import PostService from "../services/PostService";

class PostController {
  async create(request: Request, response: Response) {
    try {
      const { content, videoUrl, imageUrl } = request.body;
      const userId = request.userId as string;

      const post = await PostService.createPost(
        content,
        userId,
        videoUrl,
        imageUrl,
      );

      return response.status(201).json(post);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const userId = request.userId as string;
      const limit = Math.min(Number(request.query.limit) || 20, 50);
      const offset = Number(request.query.offset) || 0;

      const posts = await PostService.listPosts(userId, limit, offset);

      return response.status(200).json(posts);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async listByUser(request: Request, response: Response) {
    try {
      const targetUserId = request.params.userId as string;
      const currentUserId = request.userId as string;

      const posts = await PostService.listByUser(targetUserId, currentUserId);

      return response.status(200).json(posts);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async getPinned(request: Request, response: Response) {
    try {
      const targetUserId = request.params.userId as string;
      const currentUserId = request.userId as string;

      const post = await PostService.getPinnedPost(targetUserId, currentUserId);

      return response.status(200).json(post);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async pin(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.userId as string;

      const result = await PostService.pinPost(id, userId);

      return response.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async unpin(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.userId as string;

      const result = await PostService.unpinPost(id, userId);

      return response.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.userId as string;

      const result = await PostService.deletePost(id, userId);

      return response.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default new PostController();
