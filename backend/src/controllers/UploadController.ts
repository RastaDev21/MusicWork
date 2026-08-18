import { Request, Response } from "express";
import User from "../models/User";
import cloudinary from "../config/cloudinary";

// Apaga um arquivo antigo do Cloudinary. Nunca lança erro — se falhar
// (ex: já tinha sido apagado, ID errado), só loga e segue, pra nunca
// travar o upload da foto nova por causa da limpeza da antiga.
async function deleteCloudinaryFile(publicId: string | null | undefined) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      `Erro ao apagar arquivo órfão do Cloudinary (${publicId}):`,
      error,
    );
  }
}

export class UploadController {
  async uploadAvatar(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      const userId = req.userId;
      const avatarUrl = req.file.path;
      const avatarPublicId = (req.file as any).filename as string | undefined;

      const user = await User.findByPk(userId);
      const oldPublicId = user?.avatarPublicId;

      await User.update(
        { avatarUrl, avatarPublicId },
        { where: { id: userId } },
      );

      if (oldPublicId && oldPublicId !== avatarPublicId) {
        deleteCloudinaryFile(oldPublicId);
      }

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

      const userId = req.userId;
      const coverUrl = req.file.path;
      const coverPublicId = (req.file as any).filename as string | undefined;

      const user = await User.findByPk(userId);
      const oldPublicId = user?.coverPublicId;

      await User.update({ coverUrl, coverPublicId }, { where: { id: userId } });

      if (oldPublicId && oldPublicId !== coverPublicId) {
        deleteCloudinaryFile(oldPublicId);
      }

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

      const userId = req.userId;
      const presentationVideoUrl = req.file.path;

      await User.update({ presentationVideoUrl }, { where: { id: userId } });

      return res.json({ presentationVideoUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do vídeo!" });
    }
  }

  async deletePresentationVideo(req: Request, res: Response) {
    try {
      const userId = req.userId;
      await User.update(
        { presentationVideoUrl: null },
        { where: { id: userId } },
      );
      return res.json({ message: "Vídeo removido com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover o vídeo!" });
    }
  }

  async uploadProfileAudio(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum áudio enviado!" });
      }

      const userId = req.userId;
      const profileAudioUrl = req.file.path;

      await User.update({ profileAudioUrl }, { where: { id: userId } });

      return res.json({ profileAudioUrl });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do áudio!" });
    }
  }

  async deleteProfileAudio(req: Request, res: Response) {
    try {
      const userId = req.userId;
      await User.update({ profileAudioUrl: null }, { where: { id: userId } });
      return res.json({ message: "Áudio removido com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover o áudio!" });
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

  async uploadShowFlyer(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      return res.json({ flyerUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do flyer!" });
    }
  }

  async uploadMessageImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada!" });
      }

      return res.json({ imageUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload da imagem!" });
    }
  }

  async uploadMessageVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum vídeo enviado!" });
      }

      return res.json({ videoUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao fazer upload do vídeo!" });
    }
  }
}
