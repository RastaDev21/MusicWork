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

  async uploadPresentationVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum vídeo enviado!" });
      }

      const userId = req.headers["userId"] || req.headers["userid"];
      const presentationVideoUrl = req.file.path;

      await User.update({ presentationVideoUrl }, { where: { id: userId } });

      return res.json({ presentationVideoUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do vídeo!" });
    }
  }

  async deletePresentationVideo(req: Request, res: Response) {
    try {
      const userId = req.headers["userId"] || req.headers["userid"];
      await User.update(
        { presentationVideoUrl: null },
        { where: { id: userId } },
      );
      return res.json({ message: "Vídeo removido com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover o vídeo!" });
    }
  }

  async uploadPostVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum vídeo enviado!" });
      }

      return res.json({ videoUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do vídeo!" });
    }
  }

  async uploadPostImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      return res.json({ imageUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload da imagem!" });
    }
  }
}
