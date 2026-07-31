import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import EmailService from "./EmailService";
import { JWT_SECRET } from "../config/auth";

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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

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

    try {
      await EmailService.sendPasswordReset(user.email, user.name, token);
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

  async changeEmail(userId: string, currentPassword: string, newEmail: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) throw new Error("Senha atual incorreta");

    const emailInUse = await User.findOne({ where: { email: newEmail } });
    if (emailInUse && emailInUse.id !== userId) {
      throw new Error("Este email já está em uso por outra conta");
    }

    user.email = newEmail;
    await user.save();

    return { id: user.id, email: user.email };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) throw new Error("Senha atual incorreta");

    if (newPassword.length < 6) {
      throw new Error("A nova senha deve ter no mínimo 6 caracteres");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Senha atualizada com sucesso" };
  }
}

export default new AuthService();
