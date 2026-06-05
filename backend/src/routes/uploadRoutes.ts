import { Router } from "express";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const uploadRouter = Router();
const uploadController = new UploadController();

// Rota para foto de perfil
// "avatar" é o nome do campo que o frontend vai enviar
uploadRouter.post(
  "/upload/avatar",
  authMiddleware, // 1º verifica se está logado
  upload.single("avatar"), // 2º recebe o arquivo
  uploadController.uploadAvatar, // 3º salva no banco
);

// Rota para foto de capa
uploadRouter.post(
  "/upload/cover",
  authMiddleware,
  upload.single("cover"),
  uploadController.uploadCover,
);

export default uploadRouter;
