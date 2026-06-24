import { Request, Response } from "express";
import User from "../models/User";

export class UploadController {
  async uploadAvatar(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      const userId = req.headers["userId"] || req.headers["userid"];
      const avatarUrl = req.file.path;

      await User.update({ avatarUrl }, { where: { id: userId } });

      return res.json({ avatarUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload!" });
    }
  }

  async uploadCover(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      const userId = req.headers["userId"] || req.headers["userid"];
      const coverUrl = req.file.path;

      await User.update({ coverUrl }, { where: { id: userId } });

      return res.json({ coverUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload!" });
    }
  }
}
