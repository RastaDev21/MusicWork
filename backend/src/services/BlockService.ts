import { Op } from "sequelize";
import Block from "../models/Block";
import Follow from "../models/Follow";
import User from "../models/User";

class BlockService {
  // Bloquear desfaz o seguir nos dois sentidos. Quem foi bloqueado não é
  // avisado.
  async block(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new Error("Você não pode bloquear a si mesmo");
    }

    const blocked = await User.findByPk(blockedId, {
      attributes: ["id", "isSupport"],
    });
    if (!blocked) throw new Error("Usuário não encontrado");
    // O suporte é o canal de denúncia e de ajuda: não pode ser bloqueado
    if (blocked.isSupport) {
      throw new Error("A conta de suporte não pode ser bloqueada");
    }

    await Block.findOrCreate({ where: { blockerId, blockedId } });
    await Follow.destroy({
      where: {
        [Op.or]: [
          { followerId: blockerId, followingId: blockedId },
          { followerId: blockedId, followingId: blockerId },
        ],
      },
    });
    return { blocked: true };
  }

  async unblock(blockerId: string, blockedId: string) {
    await Block.destroy({ where: { blockerId, blockedId } });
    return { blocked: false };
  }

  // Quem eu bloqueei, mais recentes primeiro (lista de Configurações)
  async listBlocked(blockerId: string) {
    const blocks = await Block.findAll({
      where: { blockerId },
      attributes: ["blockedId"],
      order: [["createdAt", "DESC"]],
    });
    const ids = blocks.map(block => block.blockedId);
    if (ids.length === 0) return [];
    const users = await User.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "name", "avatarUrl", "instrument", "city"],
    });
    const byId = new Map(users.map(user => [user.id, user]));
    return ids.map(id => byId.get(id)).filter(Boolean);
  }

  // Quem eu bloqueei e quem me bloqueou, numa consulta só
  async getBlockSets(userId: string) {
    const blocks = await Block.findAll({
      where: { [Op.or]: [{ blockerId: userId }, { blockedId: userId }] },
      attributes: ["blockerId", "blockedId"],
    });
    const byMe = new Set<string>();
    const againstMe = new Set<string>();
    for (const block of blocks) {
      if (block.blockerId === userId) byMe.add(block.blockedId);
      else againstMe.add(block.blockerId);
    }
    return { byMe, againstMe };
  }

  // O conteúdo dessas pessoas some para mim (feed, comentários, busca, Work,
  // notificações), nos dois sentidos do bloqueio.
  async getHiddenUserIds(userId: string) {
    const { byMe, againstMe } = await this.getBlockSets(userId);
    return [...byMe, ...againstMe];
  }

  async isBlockedEitherWay(userA: string, userB: string) {
    const count = await Block.count({
      where: {
        [Op.or]: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
    });
    return count > 0;
  }

  // Situação entre quem vê e o outro perfil: "me" = eu bloqueei,
  // "them" = fui bloqueado, null = nenhum bloqueio.
  async getBlockStatus(viewerId: string, otherId: string) {
    const blocks = await Block.findAll({
      where: {
        [Op.or]: [
          { blockerId: viewerId, blockedId: otherId },
          { blockerId: otherId, blockedId: viewerId },
        ],
      },
      attributes: ["blockerId"],
    });
    if (blocks.some(block => block.blockerId === viewerId)) return "me";
    if (blocks.length > 0) return "them";
    return null;
  }
}

export default new BlockService();
