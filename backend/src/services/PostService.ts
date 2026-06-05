import Post from "../models/Post";
import User from "../models/User";

class PostService {
  async createPost(content: string, userId: string) {
    if (!content || content.trim() === "") {
      throw new Error("O conteúdo do post não pode ser vazio");
    }

    const post = await Post.create({ content, userId });

    return post;
  }

  async listPosts() {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "instrument",
            "secondaryProfession",
            "city",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return posts;
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
