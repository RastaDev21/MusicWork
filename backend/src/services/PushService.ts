import webpush, { WebPushError } from "web-push";
import PushSubscription from "../models/PushSubscription";

export interface PushPayload {
  title: string;
  body: string;
  url: string; // rota do frontend aberta ao tocar na notificação
  tag?: string; // mesma tag substitui a notificação anterior no aparelho
  icon?: string;
}

interface SubscriptionInput {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
}

class PushService {
  private configured: boolean | null = null;
  private publicKey: string | null = null;

  // Lido na primeira chamada, não no import, para não depender da ordem em
  // que o dotenv é carregado. Sem as chaves VAPID (ou com chave inválida) o
  // push fica desligado e o resto do app segue normal — nunca lança.
  private isConfigured() {
    if (this.configured === null) {
      this.configured = false;
      // trim: espaço ou quebra de linha colados junto no painel do Render
      const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
      const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
      if (publicKey && privateKey) {
        try {
          webpush.setVapidDetails(
            process.env.VAPID_SUBJECT?.trim() || "https://musicwork.com.br",
            publicKey,
            privateKey,
          );
          this.publicKey = publicKey;
          this.configured = true;
        } catch (error) {
          console.error(
            "Chaves VAPID inválidas, push desligado:",
            (error as Error).message,
          );
        }
      }
    }
    return this.configured;
  }

  getPublicKey() {
    return this.isConfigured() ? this.publicKey : null;
  }

  async subscribe(userId: string, subscription: SubscriptionInput) {
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;

    if (
      typeof endpoint !== "string" ||
      !endpoint.startsWith("https://") ||
      typeof p256dh !== "string" ||
      typeof auth !== "string"
    ) {
      throw new Error("Inscrição de notificação inválida");
    }

    // Mesmo aparelho, outra conta: a inscrição passa para quem logou agora.
    const existing = await PushSubscription.findOne({ where: { endpoint } });
    if (existing) {
      await existing.update({ userId, p256dh, auth });
      return { message: "Notificações ativadas" };
    }

    await PushSubscription.create({ userId, endpoint, p256dh, auth });
    return { message: "Notificações ativadas" };
  }

  async unsubscribe(userId: string, endpoint: unknown) {
    if (typeof endpoint !== "string") {
      throw new Error("Endpoint não informado");
    }
    await PushSubscription.destroy({ where: { userId, endpoint } });
    return { message: "Notificações desativadas" };
  }

  // Nunca lança: falha de push não pode derrubar a ação que a disparou
  // (seguir, comentar, mandar mensagem).
  async sendToUser(
    userId: string,
    payload: PushPayload,
    urgency: "normal" | "high" = "normal",
  ) {
    if (!this.isConfigured()) return;

    try {
      const subscriptions = await PushSubscription.findAll({
        where: { userId },
      });
      await Promise.all(
        subscriptions.map(sub => this.send(sub, payload, urgency)),
      );
    } catch (error) {
      console.error(
        "Erro ao enviar notificação push:",
        (error as Error).message,
      );
    }
  }

  private async send(
    sub: PushSubscription,
    payload: PushPayload,
    urgency: "normal" | "high",
  ) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload),
        { TTL: 60 * 60 * 24, urgency },
      );
    } catch (error) {
      // 404/410: o aparelho cancelou a inscrição (desinstalou o app, revogou
      // a permissão). Apaga para não tentar de novo.
      const statusCode = (error as WebPushError).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await sub.destroy();
        return;
      }
      // Só o status (ou o código do erro de rede): o objeto de erro inteiro
      // traz endpoint e cabeçalhos.
      const detail =
        statusCode ?? (error as NodeJS.ErrnoException).code ?? "desconhecido";
      console.error(`Falha ao enviar push (${detail})`);
    }
  }
}

export default new PushService();
