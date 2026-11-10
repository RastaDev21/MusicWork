import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// Rotas só da conta de suporte (fila de denúncias). Vem depois do
// authMiddleware. Confere no banco, não no token: o token não carrega
// isSupport.
export async function supportMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const user = await User.findByPk(request.userId, {
    attributes: ["isSupport"],
  });
  if (!user?.isSupport) {
    return response.status(403).json({ error: "Acesso restrito ao suporte" });
  }
  return next();
}
