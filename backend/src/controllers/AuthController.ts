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

  async forgotPassword(request: Request, response: Response) {
    try {
      const { email } = request.body;

      if (!email) {
        return response.status(400).json({
          error: "Email é obrigatório",
        });
      }

      const result = await AuthService.forgotPassword(email);

      return response.status(200).json(result);
    } catch (error: any) {
      console.error("ERRO EM forgotPassword:", error);
      return response
        .status(500)
        .json({ error: "Erro ao processar solicitação" });
    }
  }

  async resetPassword(request: Request, response: Response) {
    try {
      const { token, password } = request.body;

      if (!token || !password) {
        return response.status(400).json({
          error: "Token e nova senha são obrigatórios",
        });
      }

      if (password.length < 6) {
        return response.status(400).json({
          error: "A senha deve ter no mínimo 6 caracteres",
        });
      }

      const result = await AuthService.resetPassword(token, password);

      return response.status(200).json(result);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
