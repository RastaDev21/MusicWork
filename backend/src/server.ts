import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import "./database";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";
import uploadRouter from "./routes/uploadRoutes";
import likeRouter from "./routes/likeRoutes";

import User from "./models/User";
import Post from "./models/Post";
import Like from "./models/Like";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(userRouter);
app.use(authRouter);
app.use(postRouter);
app.use(uploadRouter);
app.use(likeRouter);

app.get("/health", (request, response) => {
  return response.json({ status: "ok" });
});

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.sync({ alter: true }).then(() => {
  console.log("✅ Tabela users sincronizada");
});

Post.sync({ alter: true }).then(() => {
  console.log("✅ Tabela posts sincronizada");
});

User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Like, { foreignKey: "postId" });
Like.belongsTo(Post, { foreignKey: "postId" });

Like.sync({ alter: true }).then(() => {
  console.log("✅ Tabela likes sincronizada");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
