import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({
          error: "Email e senha são obrigatórios",
        });
      }

      const result = await AuthService.login(email, password);

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();
