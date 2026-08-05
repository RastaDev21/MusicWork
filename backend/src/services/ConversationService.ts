import { Op, fn, col } from "sequelize";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import User from "../models/User";

class ConversationService {
  async findOrCreateConversation(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new Error("Você não pode iniciar uma conversa consigo mesmo");
    }

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id: userId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: userId,
        user2Id: otherUserId,
      });
    }

    return conversation;
  }

  async startSupportConversation(userId: string) {
    const support = await User.findOne({ where: { isSupport: true } });
    if (!support) {
      throw new Error("Conta de suporte não configurada");
    }
    return this.findOrCreateConversation(userId, support.id);
  }

  async listConversations(userId: string) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["id", "name", "avatarUrl", "isSupport"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["id", "name", "avatarUrl", "isSupport"],
        },
      ],
    });

    const conversationIds = conversations.map(c => c.id);

    // Uma única query agregada para todas as contagens de não lidas (evita N+1).
    const unreadRows = conversationIds.length
      ? ((await Message.findAll({
          where: {
            conversationId: { [Op.in]: conversationIds },
            senderId: { [Op.ne]: userId },
            read: false,
          },
          attributes: ["conversationId", [fn("COUNT", col("id")), "count"]],
          group: ["conversationId"],
          raw: true,
        })) as unknown as { conversationId: string; count: string }[])
      : [];

    const unreadByConversation = new Map<string, number>();
    for (const row of unreadRows) {
      unreadByConversation.set(row.conversationId, Number(row.count));
    }

    const result = await Promise.all(
      conversations.map(async conv => {
        // Última mensagem ainda é por conversa (LIMIT 1 indexado);
        // pode virar um DISTINCT ON único se um dia for gargalo.
        const lastMessage = await Message.findOne({
          where: { conversationId: conv.id },
          order: [["createdAt", "DESC"]],
        });

        const otherUser =
          (conv as any).user1Id === userId
            ? (conv as any).user2
            : (conv as any).user1;

        return {
          id: conv.id,
          otherUser,
          lastMessage,
          unreadCount: unreadByConversation.get(conv.id) || 0,
        };
      }),
    );

    result.sort((a, b) => {
      if (a.otherUser.isSupport && !b.otherUser.isSupport) return -1;
      if (b.otherUser.isSupport && !a.otherUser.isSupport) return 1;

      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return dateB - dateA;
    });

    return result;
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw new Error("Conversa não encontrada");
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new Error("Você não faz parte dessa conversa");
    }

    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "avatarUrl"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { read: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          read: false,
        },
      },
    );

    return messages;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content?: string,
    imageUrl?: string,
    videoUrl?: string,
  ) {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw new Error("Conversa não encontrada");
    if (
      conversation.user1Id !== senderId &&
      conversation.user2Id !== senderId
    ) {
      throw new Error("Você não faz parte dessa conversa");
    }

    const hasContent = content && content.trim() !== "";
    if (!hasContent && !imageUrl && !videoUrl) {
      throw new Error("A mensagem precisa ter texto, imagem ou vídeo");
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: hasContent ? content : null,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    });

    const withSender = await Message.findByPk(message.id, {
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "avatarUrl"] },
      ],
    });

    return withSender;
  }

  async getUnreadCount(userId: string) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      attributes: ["id"],
    });

    const conversationIds = conversations.map(c => c.id);
    if (conversationIds.length === 0) return 0;

    const count = await Message.count({
      where: {
        conversationId: { [Op.in]: conversationIds },
        senderId: { [Op.ne]: userId },
        read: false,
      },
    });

    return count;
  }
}

export default new ConversationService();
