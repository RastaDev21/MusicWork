import Work from "../models/Work";
import User from "../models/User";

class WorkService {
  async createWork(data: {
    userId: string;
    type: "offer" | "request";
    title: string;
    description?: string;
    price?: string;
    city?: string;
    category?: string;
    subcategory?: string;
    contact?: string;
  }) {
    const work = await Work.create(data);
    return work;
  }

  async listWorks() {
    const works = await Work.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "instrument", "city", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return works;
  }

  async deleteWork(workId: string, userId: string) {
    const work = await Work.findByPk(workId);

    if (!work) {
      throw new Error("Work não encontrado");
    }

    if (work.userId !== userId) {
      throw new Error("Você não pode deletar o work de outro usuário");
    }

    await work.destroy();
    return { message: "Work deletado com sucesso" };
  }
  async updateWork(
    workId: string,
    userId: string,
    data: {
      type?: "offer" | "request";
      title?: string;
      description?: string;
      price?: string;
      city?: string;
      category?: string;
      subcategory?: string;
      contact?: string;
    },
  ) {
    const work = await Work.findByPk(workId);

    if (!work) throw new Error("Work não encontrado");
    if (work.userId !== userId)
      throw new Error("Você não pode editar o work de outro usuário");

    await work.update(data);
    return work;
  }
}

export default new WorkService();
