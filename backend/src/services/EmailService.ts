import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendPasswordReset(to: string, name: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_RESET_URL || "https://musicwork.com.br/reset-password"}?token=${token}`;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MusicWork <contato@musicwork.com.br>",
      to,
      subject: "Recuperação de senha - MusicWork",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Olá, ${name}!</h2>
          <p>Recebemos uma solicitação para redefinir sua senha no MusicWork.</p>
          <p>Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">
            Redefinir senha
          </a>
          <p>Se você não solicitou isso, pode ignorar este email com segurança.</p>
        </div>
      `,
    });

    // O SDK do Resend não lança exceção em erro de API — ele retorna
    // { data, error }. Sem checar isso, um envio que falha (rate limit,
    // domínio, etc.) passava como se tivesse dado certo.
    if (result.error) {
      throw new Error(
        `Falha ao enviar email de recuperação: ${result.error.message}`,
      );
    }

    return result;
  }

  async sendEmailVerification(to: string, name: string, token: string) {
    const verifyUrl = `${process.env.FRONTEND_VERIFY_URL || "https://musicwork.com.br/verify-email"}?token=${token}`;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MusicWork <contato@musicwork.com.br>",
      to,
      subject: "Confirme seu email - MusicWork",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Olá, ${name}!</h2>
          <p>Falta só um passo para ativar sua conta no MusicWork.</p>
          <p>Clique no botão abaixo para confirmar seu email. Este link expira em 24 horas.</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">
            Confirmar email
          </a>
          <p>Se você não criou uma conta no MusicWork, pode ignorar este email com segurança.</p>
        </div>
      `,
    });

    if (result.error) {
      throw new Error(
        `Falha ao enviar email de verificação: ${result.error.message}`,
      );
    }

    return result;
  }
}

export default new EmailService();
