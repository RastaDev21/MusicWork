import { Request, Response } from "express";
import User from "../models/User";

export class UploadController {
  // Faz upload da foto de perfil (avatar)
  async uploadAvatar(req: Request, res: Response) {
    try {
      // req.file é o arquivo que o multer recebeu
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      const userId = (req as any).userId; // vem do authMiddleware

      // Monta o endereço público da imagem
      // Ex: "/uploads/avatars/42-1717600000000.jpg"
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Atualiza o usuário no banco com o novo endereço
      await User.update({ avatarUrl }, { where: { id: userId } });

      return res.json({ avatarUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload!" });
    }
  }

  // Faz upload da foto de capa (cover)
  async uploadCover(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      const userId = (req as any).userId;

      const coverUrl = `/uploads/covers/${req.file.filename}`;

      await User.update({ coverUrl }, { where: { id: userId } });

      return res.json({ coverUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload!" });
    }
  }
}
