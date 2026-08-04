import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  upload,
  uploadVideo,
  uploadAudio,
} from "../middlewares/uploadMiddleware";

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

function handleAudioUpload(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadAudio.single(field)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "Áudio muito grande. O limite é 20MB." });
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
  "/upload/profile-audio",
  authMiddleware,
  handleAudioUpload("profileAudio"),
  uploadController.uploadProfileAudio,
);

uploadRouter.delete(
  "/upload/profile-audio",
  authMiddleware,
  uploadController.deleteProfileAudio,
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

uploadRouter.post(
  "/upload/message-image",
  authMiddleware,
  handleUpload("messageImage"),
  uploadController.uploadMessageImage,
);

uploadRouter.post(
  "/upload/message-video",
  authMiddleware,
  handleVideoUpload("messageVideo"),
  uploadController.uploadMessageVideo,
);

export default uploadRouter;
