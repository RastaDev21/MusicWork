import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import EmailService from "./EmailService";

class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        instrument: user.instrument,
        city: user.city,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    console.log("Usuário encontrado?", user ? user.email : "NÃO ENCONTRADO");

    if (!user) {
      return {
        message:
          "Se este email estiver cadastrado, você receberá as instruções em instantes.",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    console.log("Tentando enviar email via Resend...");
    try {
      const result = await EmailService.sendPasswordReset(
        user.email,
        user.name,
        token,
      );
      console.log("Resend respondeu:", result);
    } catch (emailError) {
      console.error("ERRO AO ENVIAR EMAIL:", emailError);
    }

    return {
      message:
        "Se este email estiver cadastrado, você receberá as instruções em instantes.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error("Token inválido ou expirado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: "Senha atualizada com sucesso" };
  }
}

export default new AuthService();
