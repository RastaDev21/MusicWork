import { Request, Response } from "express";
import PostService from "../services/PostService";

class PostController {
  async create(request: Request, response: Response) {
    try {
      const { content } = request.body;
      const userId = request.headers["userId"] as string;

      const post = await PostService.createPost(content, userId);

      return response.status(201).json(post);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;

      const posts = await PostService.listPosts(userId);

      return response.status(200).json(posts);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.headers["userId"] as string;

      const result = await PostService.deletePost(id, userId);

      return response.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default new PostController();
