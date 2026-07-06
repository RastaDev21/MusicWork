import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  async create(request: Request, response: Response) {
    try {
      const {
        name,
        email,
        password,
        instrument,
        secondaryInstruments,
        secondaryProfession,
        city,
        bio,
      } = request.body;

      if (!name || !email || !password) {
        return response.status(400).json({
          error: "Nome, email e senha são obrigatórios",
        });
      }

      const user = await UserService.createUser({
        name,
        email,
        password,
        instrument,
        secondaryInstruments,
        secondaryProfession,
        city,
        bio,
      });

      return response.status(201).json(user);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
  async profile(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;

      const user = await UserService.findById(userId);

      return response.status(200).json(user);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const userId = request.headers["userId"] as string;
      const {
        name,
        instrument,
        secondaryInstruments,
        secondaryProfession,
        city,
        bio,
        genre,
        instagram,
        youtube,
        spotify,
      } = request.body;

      const user = await UserService.updateUser(userId, {
        name,
        instrument,
        secondaryInstruments,
        secondaryProfession,
        city,
        bio,
        genre,
        instagram,
        youtube,
        spotify,
      });

      return response.status(200).json(user);
    } catch (error: unknown) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
  async search(request: Request, response: Response) {
    try {
      const { q, instrument, genre, city } = request.query;

      const users = await UserService.searchUsers({
        query: q as string,
        instrument: instrument as string,
        genre: genre as string,
        city: city as string,
      });

      return response.status(200).json(users);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
  async show(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const user = await UserService.findById(id);
      return response.status(200).json(user);
    } catch (error: any) {
      return response.status(404).json({ error: error.message });
    }
  }
}

export default new UserController();
