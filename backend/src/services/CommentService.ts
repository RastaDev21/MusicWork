import Comment from "../models/Comment";
import User from "../models/User";
import Post from "../models/Post";
import NotificationService from "./NotificationService";

class CommentService {
  async create(
    userId: string,
    postId: string,
    content: string,
    parentId?: string | null,
  ) {
    const comment = await Comment.create({
      userId,
      postId,
      content,
      parentId: parentId || null,
    });
    const withUser = await Comment.findByPk(comment.id, {
      include: [
        { model: User, attributes: ["id", "name", "avatarUrl", "instrument"] },
      ],
    });

    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (parentComment) {
        await NotificationService.create(
          parentComment.userId,
          userId,
          "reply",
          postId,
        );
      }
    } else {
      const post = await Post.findByPk(postId);
      if (post) {
        await NotificationService.create(
          post.userId,
          userId,
          "comment",
          postId,
        );
      }
    }

    return withUser;
  }

  async listByPost(postId: string) {
    return Comment.findAll({
      where: { postId },
      include: [
        { model: User, attributes: ["id", "name", "avatarUrl", "instrument"] },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  async delete(commentId: string, userId: string) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comentário não encontrado");
    if (comment.userId !== userId) throw new Error("Sem permissão");

    await Comment.destroy({ where: { parentId: commentId } }); // apaga respostas junto
    await comment.destroy();
    return { message: "Comentário deletado" };
  }

  async countByPost(postId: string) {
    return Comment.count({ where: { postId } });
  }
}

export default new CommentService();
