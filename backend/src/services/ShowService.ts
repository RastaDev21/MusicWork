import { Op } from "sequelize";
import Show from "../models/Show";
import User from "../models/User";

class ShowService {
  async createShow(data: {
    userId: string;
    title: string;
    dateTime: string;
    city: string;
    genre: string;
    venue?: string;
    description?: string;
    flyerUrl?: string;
  }) {
    const show = await Show.create(data);
    return show;
  }

  async listShows(filters: { city?: string; genre?: string; date?: string }) {
    const { city, genre, date } = filters;
    const where: any = {
      dateTime: { [Op.gte]: new Date() },
    };

    if (city) where.city = city;
    if (genre) where.genre = genre;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.dateTime = { [Op.gte]: start, [Op.lt]: end };
    }

    const shows = await Show.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "instrument", "city", "avatarUrl"],
        },
      ],
      order: [["dateTime", "ASC"]],
    });

    return shows;
  }

  async listShowsByUser(userId: string) {
    const shows = await Show.findAll({
      where: {
        userId,
        dateTime: { [Op.gte]: new Date() },
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "instrument", "city", "avatarUrl"],
        },
      ],
      order: [["dateTime", "ASC"]],
    });

    return shows;
  }

  async updateShow(
    showId: string,
    userId: string,
    data: {
      title?: string;
      dateTime?: string;
      city?: string;
      genre?: string;
      venue?: string;
      description?: string;
    },
  ) {
    const show = await Show.findByPk(showId);

    if (!show) throw new Error("Show não encontrado");
    if (show.userId !== userId) {
      throw new Error("Você não pode editar o show de outro usuário");
    }

    await show.update(data);
    return show;
  }

  async deleteShow(showId: string, userId: string) {
    const show = await Show.findByPk(showId);

    if (!show) throw new Error("Show não encontrado");
    if (show.userId !== userId) {
      throw new Error("Você não pode deletar o show de outro usuário");
    }

    await show.destroy();
    return { message: "Show deletado com sucesso" };
  }
}

export default new ShowService();
