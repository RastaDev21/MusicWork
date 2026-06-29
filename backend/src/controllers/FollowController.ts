import { Request, Response } from "express";
import FollowService from "../services/FollowService";

class FollowController {
  async toggle(request: Request, response: Response) {
    try {
      const followerId = request.headers["userId"] as string;
      const followingId = request.params.id as string;
      const result = await FollowService.toggle(followerId, followingId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async status(request: Request, response: Response) {
    try {
      const followerId = request.headers["userId"] as string;
      const followingId = request.params.id as string;
      const following = await FollowService.isFollowing(
        followerId,
        followingId,
      );
      const followers = await FollowService.countFollowers(followingId);
      const followingCount = await FollowService.countFollowing(followingId);

      return response
        .status(200)
        .json({ following, followers, followingCount });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new FollowController();
