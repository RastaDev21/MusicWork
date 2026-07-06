import Notification from "../models/Notification";
import User from "../models/User";

class NotificationService {
  async create(
    recipientId: string,
    senderId: string,
    type: "follow" | "like" | "comment" | "reply" | "comment_like",
    postId?: string,
  ) {
    if (recipientId === senderId) return null; // não notifica a si mesmo

    return Notification.create({
      recipientId,
      senderId,
      type,
      postId: postId || null,
    });
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
