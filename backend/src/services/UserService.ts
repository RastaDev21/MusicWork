import { Op, fn, col, where as sqlWhere } from "sequelize";
import User from "../models/User";
import bcrypt from "bcrypt";

// Projeção pública do perfil (sem email nem campos sensíveis).
// Usada no endpoint /users/:id, consumido por qualquer usuário autenticado.
function toPublicProfile(user: User) {
  return {
    id: user.id,
    name: user.name,
    instrument: user.instrument,
    secondaryInstruments: user.secondaryInstruments,
    secondaryProfession: user.secondaryProfession,
    city: user.city,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    presentationVideoUrl: user.presentationVideoUrl,
    genre: user.genre,
    secondaryGenres: user.secondaryGenres,
    nationality: user.nationality,
    instagram: user.instagram,
    youtube: user.youtube,
    spotify: user.spotify,
    favoriteSongUrl: user.favoriteSongUrl,
    isProfessor: user.isProfessor,
    facebook: user.facebook,
    tiktok: user.tiktok,
    profileAudioUrl: user.profileAudioUrl,
    isSupport: user.isSupport,
  };
}

class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    instrument?: string;
    secondaryInstruments?: string[];
    secondaryProfession?: string;
    city?: string;
    bio?: string;
    genre?: string;
    instagram?: string | null;
    youtube?: string | null;
    spotify?: string | null;
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
      secondaryInstruments: user.secondaryInstruments,
      secondaryProfession: user.secondaryProfession,
      city: user.city,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      genre: user.genre,
    };
  }

  // Perfil próprio (autenticado): inclui email.
  async findById(id: string) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return { ...toPublicProfile(user), email: user.email };
  }

  // Perfil de terceiros (/users/:id): sem email.
  async findPublicById(id: string) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return toPublicProfile(user);
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      instrument?: string;
      secondaryInstruments?: string[];
      secondaryProfession?: string;
      city?: string;
      bio?: string;
      avatarUrl?: string | null;
      coverUrl?: string | null;
      presentationVideoUrl?: string | null;
      genre?: string | null;
      secondaryGenres?: string[];
      nationality?: string | null;
      instagram?: string | null;
      youtube?: string | null;
      spotify?: string | null;
      favoriteSongUrl?: string | null;
      isProfessor?: boolean;
      facebook?: string | null;
      tiktok?: string | null;
      profileAudioUrl?: string | null;
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
      secondaryInstruments: user.secondaryInstruments,
      secondaryProfession: user.secondaryProfession,
      city: user.city,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      presentationVideoUrl: user.presentationVideoUrl,
      genre: user.genre,
      secondaryGenres: user.secondaryGenres,
      nationality: user.nationality,
      instagram: user.instagram,
      youtube: user.youtube,
      spotify: user.spotify,
      favoriteSongUrl: user.favoriteSongUrl,
      isProfessor: user.isProfessor,
      facebook: user.facebook,
      tiktok: user.tiktok,
      profileAudioUrl: user.profileAudioUrl,
    };
  }

  async searchUsers(params: {
    query?: string;
    instrument?: string;
    genre?: string;
    city?: string;
    nationality?: string;
    isProfessor?: boolean;
  }) {
    const { query, instrument, genre, city, nationality, isProfessor } = params;

    const conditions: any[] = [];

    const unaccentLike = (field: string, value: string) =>
      sqlWhere(fn("unaccent", fn("lower", col(field))), {
        [Op.like]: fn("unaccent", `%${value.toLowerCase()}%`),
      });

    if (query && query.trim().length >= 2) {
      conditions.push({
        [Op.or]: [
          unaccentLike("name", query),
          unaccentLike("instrument", query),
          unaccentLike("city", query),
          unaccentLike("secondaryProfession", query),
          unaccentLike("genre", query),
        ],
      });
    }

    conditions.push({ isSupport: { [Op.not]: true } });

    if (instrument) conditions.push(unaccentLike("instrument", instrument));
    if (genre) conditions.push(unaccentLike("genre", genre));
    if (city) conditions.push(unaccentLike("city", city));
    if (nationality) conditions.push({ nationality });
    if (isProfessor) conditions.push({ isProfessor: true });

    const users = await User.findAll({
      where: conditions.length ? { [Op.and]: conditions } : {},
      attributes: [
        "id",
        "name",
        "instrument",
        "secondaryInstruments",
        "secondaryProfession",
        "city",
        "bio",
        "avatarUrl",
        "genre",
        "nationality",
        "isProfessor",
      ],
      limit: 20,
    });

    return users;
  }

  async getSupportAccount() {
    const support = await User.findOne({ where: { isSupport: true } });
    if (!support) {
      throw new Error("Conta de suporte não configurada");
    }
    return support;
  }
}

export default new UserService();
