import Follow from "../models/Follow";
import NotificationService from "./NotificationService";

class FollowService {
  async toggle(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error("Você não pode se seguir");

    const existing = await Follow.findOne({
      where: { followerId, followingId },
    });

    if (existing) {
      await existing.destroy();
      return { following: false };
    }

    await Follow.create({ followerId, followingId });
    await NotificationService.create(followingId, followerId, "follow");
    return { following: true };
  }

  async isFollowing(followerId: string, followingId: string) {
    const existing = await Follow.findOne({
      where: { followerId, followingId },
    });
    return !!existing;
  }

  async countFollowers(userId: string) {
    return Follow.count({ where: { followingId: userId } });
  }

  async countFollowing(userId: string) {
    return Follow.count({ where: { followerId: userId } });
  }
}

export default new FollowService();
