import Notification from "../models/Notification";
import User from "../models/User";
import PushService from "./PushService";

type NotificationType =
  | "follow"
  | "like"
  | "comment"
  | "reply"
  | "comment_like";

// Mesmos textos do sino no NavBar (notificationText), sem o nome — no push o
// nome vai no título.
const PUSH_TEXT: Record<NotificationType, string> = {
  follow: "começou a seguir você",
  like: "curtiu sua publicação",
  comment: "comentou na sua publicação",
  reply: "respondeu seu comentário",
  comment_like: "curtiu seu comentário",
};

class NotificationService {
  async create(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    postId?: string,
  ) {
    if (recipientId === senderId) return null; // não notifica a si mesmo

    const notification = await Notification.create({
      recipientId,
      senderId,
      type,
      postId: postId || null,
    });

    // Sem await: a resposta da ação (seguir, curtir...) não espera o serviço
    // de push.
    this.sendPush(recipientId, senderId, type, postId);

    return notification;
  }

  private async sendPush(
    recipientId: string,
    senderId: string,
    type: NotificationType,
    postId?: string,
  ) {
    try {
      const sender = await User.findByPk(senderId, {
        attributes: ["name", "avatarUrl"],
      });
      await PushService.sendToUser(recipientId, {
        title: sender?.name || "MusicWork",
        body: PUSH_TEXT[type],
        // Mesmo destino do clique no sino (handleNotificationClick)
        url: type === "follow" ? `/musico/${senderId}` : "/feed",
        // Curtir/descurtir várias vezes substitui a notificação em vez de
        // empilhar
        tag: `${type}-${senderId}-${postId || ""}`,
        icon: sender?.avatarUrl?.startsWith("https://")
          ? sender.avatarUrl
          : undefined,
      });
    } catch (error) {
      console.error(
        "Erro ao preparar notificação push:",
        (error as Error).message,
      );
    }
  }

  async listByUser(recipientId: string) {
    return Notification.findAll({
      where: { recipientId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "avatarUrl", "instrument"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 30,
    });
  }

  async countUnread(recipientId: string) {
    return Notification.count({ where: { recipientId, read: false } });
  }

  async markAllAsRead(recipientId: string) {
    await Notification.update(
      { read: true },
      { where: { recipientId, read: false } },
    );
    return { message: "Notificações marcadas como lidas" };
  }
}

export default new NotificationService();
