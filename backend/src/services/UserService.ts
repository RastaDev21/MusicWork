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
      avatarUrl: user.avatarUrl, // 👈
      coverUrl: user.coverUrl, // 👈
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
      avatarUrl: user.avatarUrl, // 👈
      coverUrl: user.coverUrl, // 👈
    };
  }
}

export default new UserService();
