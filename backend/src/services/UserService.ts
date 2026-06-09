import User from "../models/User";
import bcrypt from "bcrypt";

class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    instrument?: string;
    secondaryProfession?: string;
    city?: string;
    bio?: string;
    genre?: string;
  }) {
    const userAlreadyExists = await User.findOne({
      where: { email: data.email },
    });

    if (userAlreadyExists) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      instrument: user.instrument,
      secondaryProfession: user.secondaryProfession,
      city: user.city,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      genre: user.genre,
    };
  }

  async findById(id: string) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      instrument: user.instrument,
      secondaryProfession: user.secondaryProfession,
      city: user.city,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      genre: user.genre,
    };
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      instrument?: string;
      secondaryProfession?: string;
      city?: string;
      bio?: string;
      avatarUrl?: string | null;
      coverUrl?: string | null;
      genre?: string | null;
    },
  ) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await user.update(data);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      instrument: user.instrument,
      secondaryProfession: user.secondaryProfession,
      city: user.city,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      genre: user.genre,
    };
  }

  async searchUsers(query: string) {
    const { Op } = require("sequelize");

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { instrument: { [Op.iLike]: `%${query}%` } },
          { city: { [Op.iLike]: `%${query}%` } },
          { secondaryProfession: { [Op.iLike]: `%${query}%` } },
          { genre: { [Op.iLike]: `%${query}%` } }, // 👈 busca por gênero!
        ],
      },
      attributes: [
        "id",
        "name",
        "instrument",
        "secondaryProfession",
        "city",
        "bio",
        "avatarUrl",
        "genre",
      ],
      limit: 20,
    });

    return users;
  }
}

export default new UserService();
