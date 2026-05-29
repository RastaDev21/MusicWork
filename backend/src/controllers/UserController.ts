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
      const { userId } = request.body;

      const user = await UserService.findById(userId);

      return response.status(200).json(user);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
