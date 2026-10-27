import { Op } from "sequelize";
import sequelize from "../database";
import User from "../models/User";
import Post from "../models/Post";
import Like from "../models/Like";
import Comment from "../models/Comment";
import CommentLike from "../models/CommentLike";
import Follow from "../models/Follow";
import Notification from "../models/Notification";
import Work from "../models/Work";
import Show from "../models/Show";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { deleteUserMedia } from "./CloudinaryService";

class AccountService {
  // Exclusão definitiva da conta (exigência da Play Store). Apaga tudo em
  // ordem explícita, sem depender de ON DELETE CASCADE — as FKs são criadas
  // pelo sync({ alter: true }) e o comportamento delas não é garantido.
  // Conversas são apagadas inteiras, para os dois lados.
  async deleteAccount(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");
    if (user.isSupport) {
      throw new Error("A conta de suporte não pode ser excluída");
    }

    // Coleta antes de apagar: ids para as exclusões e URLs de mídia para o
    // Cloudinary.
    const posts = await Post.findAll({
      where: { userId },
      attributes: ["id", "imageUrl", "videoUrl"],
    });
    const postIds = posts.map(post => post.id);

    const shows = await Show.findAll({
      where: { userId },
      attributes: ["flyerUrl"],
    });

    const conversations = await Conversation.findAll({
      where: { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] },
      attributes: ["id"],
    });
    const conversationIds = conversations.map(conv => conv.id);

    const messagesWithMedia = await Message.findAll({
      where: {
        conversationId: { [Op.in]: conversationIds },
        [Op.or]: [
          { imageUrl: { [Op.ne]: null } },
          { videoUrl: { [Op.ne]: null } },
        ],
      },
      attributes: ["imageUrl", "videoUrl"],
    });

    // Comentários do usuário + comentários feitos nos posts dele + respostas
    // de outras pessoas aos comentários dele (mesma regra do
    // CommentService.delete, que apaga as respostas junto).
    const comments = await Comment.findAll({
      where: {
        [Op.or]: [{ userId }, { postId: { [Op.in]: postIds } }],
      },
      attributes: ["id"],
    });
    const commentIds = comments.map(comment => comment.id);
    const replies = await Comment.findAll({
      where: { parentId: { [Op.in]: commentIds } },
      attributes: ["id"],
    });
    const allCommentIds = [
      ...new Set([...commentIds, ...replies.map(reply => reply.id)]),
    ];

    const mediaUrls = [
      user.avatarUrl,
      user.coverUrl,
      user.profileAudioUrl,
      user.presentationVideoUrl,
      ...posts.flatMap(post => [post.imageUrl, post.videoUrl]),
      ...shows.map(show => show.flyerUrl),
      ...messagesWithMedia.flatMap(msg => [msg.imageUrl, msg.videoUrl]),
    ];

    await sequelize.transaction(async transaction => {
      await CommentLike.destroy({
        where: {
          [Op.or]: [{ userId }, { commentId: { [Op.in]: allCommentIds } }],
        },
        transaction,
      });
      await Comment.destroy({
        where: { id: { [Op.in]: allCommentIds } },
        transaction,
      });
      await Like.destroy({
        where: { [Op.or]: [{ userId }, { postId: { [Op.in]: postIds } }] },
        transaction,
      });
      await Notification.destroy({
        where: {
          [Op.or]: [
            { recipientId: userId },
            { senderId: userId },
            { postId: { [Op.in]: postIds } },
          ],
        },
        transaction,
      });
      await Post.destroy({ where: { userId }, transaction });
      await Follow.destroy({
        where: { [Op.or]: [{ followerId: userId }, { followingId: userId }] },
        transaction,
      });
      await Work.destroy({ where: { userId }, transaction });
      await Show.destroy({ where: { userId }, transaction });
      await Message.destroy({
        where: { conversationId: { [Op.in]: conversationIds } },
        transaction,
      });
      await Conversation.destroy({
        where: { id: { [Op.in]: conversationIds } },
        transaction,
      });
      await User.destroy({ where: { id: userId }, transaction });
    });

    // Só depois do commit: se o banco falhar, a mídia continua intacta.
    // Falhas no Cloudinary são logadas e não derrubam a resposta.
    await deleteUserMedia(userId, mediaUrls);

    return { message: "Conta excluída com sucesso" };
  }
}

export default new AccountService();
