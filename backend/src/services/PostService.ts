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
}

export default new PostService();
