import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth";

interface TokenPayload {
  id: string;
  email: string;
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    request.userId = decoded.id;
    return next();
  } catch {
    return response.status(401).json({ error: "Token inválido" });
  }
}
