import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./database";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import User from "./models/User";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(authRouter);

app.get("/health", (request, response) => {
  return response.json({ status: "ok" });
});

User.sync({ alter: true }).then(() => {
  console.log("✅ Tabela users sincronizada");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
