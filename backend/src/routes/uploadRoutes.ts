import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload, uploadVideo } from "../middlewares/uploadMiddleware";

const uploadRouter = Router();
const uploadController = new UploadController();

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
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
}

function handleVideoUpload(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadVideo.single(field)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "Vídeo muito grande. O limite é 50MB." });
        }
        return res.status(400).json({ error: err.message });
      }
      if (err) {
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

uploadRouter.post(
  "/upload/presentation-video",
  authMiddleware,
  handleVideoUpload("presentationVideo"),
  uploadController.uploadPresentationVideo,
);

uploadRouter.delete(
  "/upload/presentation-video",
  authMiddleware,
  uploadController.deletePresentationVideo,
);

uploadRouter.post(
  "/upload/post-video",
  authMiddleware,
  handleVideoUpload("postVideo"),
  uploadController.uploadPostVideo,
);

uploadRouter.post(
  "/upload/post-image",
  authMiddleware,
  handleUpload("postImage"),
  uploadController.uploadPostImage,
);

uploadRouter.post(
  "/upload/show-flyer",
  authMiddleware,
  handleUpload("showFlyer"),
  uploadController.uploadShowFlyer,
);

export default uploadRouter;
