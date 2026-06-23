import multer from "multer";
import path from "path";

// Aqui definimos ONDE e COM QUE NOME salvar as fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Se for foto de perfil, salva em /uploads/avatars
    // Se for foto de capa, salva em /uploads/covers
    const folder = file.fieldname === "avatar" ? "avatars" : "covers";
    cb(null, path.join(__dirname, `../uploads/${folder}`));
  },
  filename: (req, file, cb) => {
    // Nome do arquivo: ID do usuário + data + extensão original
    // Ex: "42-1717600000000.jpg"
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
