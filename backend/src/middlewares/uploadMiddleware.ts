import multer from "multer";
import path from "path";
import fs from "fs";

// Aqui definimos ONDE e COM QUE NOME salvar as fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "avatar" ? "avatars" : "covers";
    const dir = path.join(process.cwd(), "src", "uploads", folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).userId;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${ext}`);
  },
});

// Filtro: só aceita imagens!
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
  limits: { fileSize: 10 * 1024 * 1024 }, // Máximo 10MB
});
