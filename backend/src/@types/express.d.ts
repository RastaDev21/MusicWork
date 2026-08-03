import "express";

// userId é injetado pelo authMiddleware a partir do JWT.
// Fica em req.userId (não em req.headers) — dado de aplicação, não header HTTP.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
