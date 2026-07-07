import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "musicwork/covers";
    if (file.fieldname === "avatar") folder = "musicwork/avatars";
    if (file.fieldname === "postImage") folder = "musicwork/post-images";

    const userId = (req as any).userId || "user";
    return {
      folder,
      public_id: `${userId}-${Date.now()}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, crop: "limit" }],
    };
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Só imagens são permitidas! (JPEG, PNG ou WEBP)"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, _file) => {
    const userId = (req as any).userId || "user";
    return {
      folder: "musicwork/presentation-videos",
      public_id: `${userId}-${Date.now()}`,
      resource_type: "video",
      allowed_formats: ["mp4", "mov", "webm"],
    };
  },
});

const videoFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ["video/mp4", "video/quicktime", "video/webm"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Só vídeos são permitidos! (MP4, MOV ou WEBM)"));
  }
};

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
