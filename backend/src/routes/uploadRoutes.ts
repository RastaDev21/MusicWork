import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const uploadRouter = Router();
const uploadController = new UploadController();

// Envolve o multer para capturar erros e devolver JSON
function handleUpload(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(field)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "Imagem muito grande. O limite é 10MB." });
        }
        return res.status(400).json({ error: err.message });
      }
      if (err) {
        // erro do fileFilter (formato inválido)
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
}

uploadRouter.post(
  "/upload/avatar",
  authMiddleware,
  handleUpload("avatar"),
  uploadController.uploadAvatar,
);

uploadRouter.post(
  "/upload/cover",
  authMiddleware,
  handleUpload("cover"),
  uploadController.uploadCover,
);

export default uploadRouter;
