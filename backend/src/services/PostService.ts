import Post from "../models/Post";
import User from "../models/User";
import Like from "../models/Like";
import Comment from "../models/Comment";

// Include e formatação compartilhados pelas 3 consultas de post
// (feed, perfil, post fixado) — evita repetir a mesma projeção.
const POST_INCLUDE = [
  {
    model: User,
    attributes: [
      "id",
      "name",
      "instrument",
      "secondaryProfession",
      "city",
      "avatarUrl",
    ],
  },
  { model: Like, attributes: ["userId"] },
  { model: Comment, attributes: ["id"] },
];

function formatPost(post: any, currentUserId?: string) {
  const likes = post.Likes || [];
  return {
    ...post.toJSON(),
    likesCount: likes.length,
    likedByMe: likes.some((like: any) => like.userId === currentUserId),
    commentsCount: (post.Comments || []).length,
  };
}

class PostService {
  async createPost(
    content: string,
    userId: string,
    videoUrl?: string,
    imageUrl?: string,
  ) {
    const hasContent = content && content.trim() !== "";
    const hasVideo = !!videoUrl;
    const hasImage = !!imageUrl;

    if (!hasContent && !hasVideo && !hasImage) {
      throw new Error("O post precisa ter texto, imagem ou vídeo");
    }

    const post = await Post.create({
      content: hasContent ? content : null,
      userId,
      videoUrl: videoUrl || null,
      imageUrl: imageUrl || null,
    });

    return post;
  }

  async listPosts(currentUserId?: string, limit = 20, offset = 0) {
    const posts = await Post.findAll({
      include: POST_INCLUDE,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return posts.map(post => formatPost(post, currentUserId));
  }

  // Posts de um usuário específico (perfil próprio e público).
  async listByUser(userId: string, currentUserId?: string) {
    const posts = await Post.findAll({
      where: { userId },
      include: POST_INCLUDE,
      order: [["createdAt", "DESC"]],
    });

    return posts.map(post => formatPost(post, currentUserId));
  }

  async getPinnedPost(userId: string, currentUserId?: string) {
    const post = await Post.findOne({
      where: { userId, isPinned: true },
      include: POST_INCLUDE,
    });

    if (!post) return null;

    return formatPost(post, currentUserId);
  }

  async pinPost(postId: string, userId: string) {
    const post = await Post.findByPk(postId);

    if (!post) throw new Error("Post não encontrado");
    if (post.userId !== userId) {
      throw new Error("Você não pode fixar o post de outro usuário");
    }

    await Post.update(
      { isPinned: false },
      { where: { userId, isPinned: true } },
    );

    post.isPinned = true;
    await post.save();

    return { message: "Post fixado no perfil" };
  }

  async unpinPost(postId: string, userId: string) {
    const post = await Post.findByPk(postId);

    if (!post) throw new Error("Post não encontrado");
    if (post.userId !== userId) {
      throw new Error("Você não pode alterar o post de outro usuário");
    }

    post.isPinned = false;
    await post.save();

    return { message: "Post removido do topo do perfil" };
  }

  async deletePost(postId: string, userId: string) {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new Error("Post não encontrado");
    }

    if (post.userId !== userId) {
      throw new Error("Você não pode deletar o post de outro usuário");
    }

    await post.destroy();

    return { message: "Post deletado com sucesso" };
  }
}

export default new PostService();
