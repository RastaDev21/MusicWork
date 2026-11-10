import { Op } from "sequelize";
import Follow from "../models/Follow";
import User from "../models/User";
import NotificationService from "./NotificationService";
import BlockService from "./BlockService";

const BLOCKED_FOLLOW_ERROR = "Não é possível seguir este perfil";

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

    if (await BlockService.isBlockedEitherWay(followerId, followingId)) {
      throw new Error(BLOCKED_FOLLOW_ERROR);
    }

    await Follow.create({ followerId, followingId });
    await NotificationService.create(followingId, followerId, "follow");
    return { following: true };
  }

  // Só segue, sem alternar (botão "Seguir" do feed): se o card estiver
  // desatualizado e a pessoa já seguir, não deixa de seguir sem querer.
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error("Você não pode se seguir");
    if (await BlockService.isBlockedEitherWay(followerId, followingId)) {
      throw new Error(BLOCKED_FOLLOW_ERROR);
    }

    const [, created] = await Follow.findOrCreate({
      where: { followerId, followingId },
    });
    if (created) {
      await NotificationService.create(followingId, followerId, "follow");
    }
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

  // Quem segue o perfil, mais recentes primeiro
  async listFollowers(userId: string) {
    const follows = await Follow.findAll({
      where: { followingId: userId },
      attributes: ["followerId"],
      order: [["createdAt", "DESC"]],
    });
    return this.findUsersInOrder(follows.map(follow => follow.followerId));
  }

  // Quem o perfil segue, mais recentes primeiro
  async listFollowing(userId: string) {
    const follows = await Follow.findAll({
      where: { followerId: userId },
      attributes: ["followingId"],
      order: [["createdAt", "DESC"]],
    });
    return this.findUsersInOrder(follows.map(follow => follow.followingId));
  }

  // Busca separada (sem include): as duas associações Follow → User no
  // server.ts não têm alias e uma sobrescreve a outra.
  private async findUsersInOrder(ids: string[]) {
    if (ids.length === 0) return [];
    const users = await User.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "name", "avatarUrl", "instrument", "city"],
    });
    const byId = new Map(users.map(user => [user.id, user]));
    return ids.map(id => byId.get(id)).filter(Boolean);
  }
}

export default new FollowService();
