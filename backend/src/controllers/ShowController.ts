import { Request, Response } from "express";
import ShowService from "../services/ShowService";

class ShowController {
  async create(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const { title, dateTime, city, genre, venue, description, flyerUrl } =
        request.body;

      if (!title || !dateTime || !city || !genre) {
        return response.status(400).json({
          error: "Título, data/hora, cidade e gênero são obrigatórios",
        });
      }

      const show = await ShowService.createShow({
        userId,
        title,
        dateTime,
        city,
        genre,
        venue,
        description,
        flyerUrl,
      });

      return response.status(201).json(show);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const { city, genre, date } = request.query;

      const shows = await ShowService.listShows({
        city: city as string,
        genre: genre as string,
        date: date as string,
      });

      return response.status(200).json(shows);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async listByUser(request: Request<{ userId: string }>, response: Response) {
    try {
      const { userId } = request.params;
      const shows = await ShowService.listShowsByUser(userId);
      return response.status(200).json(shows);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async update(request: Request<{ id: string }>, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.headers["userId"] as string;
      const { title, dateTime, city, genre, venue, description } = request.body;

      const show = await ShowService.updateShow(id, userId, {
        title,
        dateTime,
        city,
        genre,
        venue,
        description,
      });

      return response.status(200).json(show);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async delete(request: Request<{ id: string }>, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.headers["userId"] as string;

      const result = await ShowService.deleteShow(id, userId);
      return response.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default new ShowController();
