import { Request, Response } from "express";
import WorkService from "../services/WorkService";

class WorkController {
  async create(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const {
        type,
        title,
        description,
        price,
        city,
        category,
        subcategory,
        contact,
      } = request.body;

      if (!type || !title) {
        return response
          .status(400)
          .json({ error: "Tipo e título são obrigatórios" });
      }

      const work = await WorkService.createWork({
        userId,
        type,
        title,
        description,
        price,
        city,
        category,
        subcategory,
        contact,
      });

      return response.status(201).json(work);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const works = await WorkService.listWorks();
      return response.status(200).json(works);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.headers["userId"] as string;

      const result = await WorkService.deleteWork(id, userId);
      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const userId = request.headers["userId"] as string;
      const {
        type,
        title,
        description,
        price,
        city,
        category,
        subcategory,
        contact,
      } = request.body;
      request.body;

      const work = await WorkService.createWork({
        userId,
        type,
        title,
        description,
        price,
        city,
        category,
        subcategory,
        contact,
      });

      return response.status(200).json(work);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new WorkController();
