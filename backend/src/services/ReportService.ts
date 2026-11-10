import { Op } from "sequelize";
import sequelize from "../database";
import Report, { ReportTargetType } from "../models/Report";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import CommentLike from "../models/CommentLike";
import Like from "../models/Like";
import Notification from "../models/Notification";
import Work from "../models/Work";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import AccountService from "./AccountService";
import PushService from "./PushService";
import { deleteCloudinaryFile, publicIdFromUrl } from "./CloudinaryService";

// Mesmas chaves do REPORT_REASONS do frontend (ReportDialog)
const REASON_LABEL: Record<string, string> = {
  spam: "Spam ou golpe",
  harassment: "Assédio ou bullying",
  hate: "Discurso de ódio",
  sexual: "Nudez ou conteúdo sexual",
  violence: "Violência ou ameaça",
  child_safety: "Risco a menores de idade",
  fake: "Perfil falso",
  other: "Outro motivo",
};

const TARGET_LABEL: Record<ReportTargetType, string> = {
  post: "Publicação",
  comment: "Comentário",
  user: "Perfil",
  work: "Anúncio do Work",
  conversation: "Conversa",
};

// Quantas mensagens da conversa vão junto na denúncia
const CONVERSATION_SNAPSHOT_SIZE = 20;

type ResolveAction = "remove_content" | "delete_account" | "dismiss";

class ReportService {
  async create(
    reporterId: string,
    data: {
      targetType: ReportTargetType;
      targetId: string;
      reason: string;
      details?: string;
    },
  ) {
    const { targetType, targetId, reason } = data;
    if (!TARGET_LABEL[targetType]) throw new Error("Tipo de denúncia inválido");
    if (!REASON_LABEL[reason]) throw new Error("Escolha um motivo");
    const details = data.details?.trim().slice(0, 500) || null;

    // A mesma pessoa denunciando a mesma coisa de novo não duplica a fila
    const existing = await Report.findOne({
      where: { reporterId, targetType, targetId, status: "open" },
    });
    if (existing) return { id: existing.id };

    const { reportedUserId, snapshot } = await this.describeTarget(
      reporterId,
      targetType,
      targetId,
    );
    if (reportedUserId === reporterId) {
      throw new Error("Você não pode denunciar o próprio conteúdo");
    }

    const report = await Report.create({
      reporterId,
      targetType,
      targetId,
      reportedUserId,
      reason,
      details,
      snapshot,
    });

    // Sem await: a resposta não espera o push
    this.notifySupport(report);

    return { id: report.id };
  }

  // Dono do conteúdo + cópia do que foi denunciado
  private async describeTarget(
    reporterId: string,
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<{
    reportedUserId: string;
    snapshot: Record<string, unknown>;
  }> {
    const authorName = async (userId: string) =>
      (await User.findByPk(userId, { attributes: ["name"] }))?.name || null;

    if (targetType === "post") {
      const post = await Post.findByPk(targetId);
      if (!post) throw new Error("Publicação não encontrada");
      return {
        reportedUserId: post.userId,
        snapshot: {
          authorName: await authorName(post.userId),
          content: post.content,
          imageUrl: post.imageUrl,
          videoUrl: post.videoUrl,
        },
      };
    }

    if (targetType === "comment") {
      const comment = await Comment.findByPk(targetId);
      if (!comment) throw new Error("Comentário não encontrado");
      return {
        reportedUserId: comment.userId,
        snapshot: {
          authorName: await authorName(comment.userId),
          content: comment.content,
        },
      };
    }

    if (targetType === "user") {
      const user = await User.findByPk(targetId);
      if (!user) throw new Error("Usuário não encontrado");
      return {
        reportedUserId: user.id,
        snapshot: {
          authorName: user.name,
          content: user.bio,
          imageUrl: user.avatarUrl,
          instrument: user.instrument,
          city: user.city,
        },
      };
    }

    if (targetType === "work") {
      const work = await Work.findByPk(targetId);
      if (!work) throw new Error("Anúncio não encontrado");
      return {
        reportedUserId: work.userId,
        snapshot: {
          authorName: await authorName(work.userId),
          title: work.title,
          content: work.description,
          contact: work.contact,
        },
      };
    }

    // Conversa: só quem participa pode denunciar, e as últimas mensagens vão
    // junto (o aviso aparece no formulário de denúncia)
    const conversation = await Conversation.findByPk(targetId);
    if (
      !conversation ||
      (conversation.user1Id !== reporterId &&
        conversation.user2Id !== reporterId)
    ) {
      throw new Error("Conversa não encontrada");
    }
    const otherId =
      conversation.user1Id === reporterId
        ? conversation.user2Id
        : conversation.user1Id;
    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      include: [{ model: User, as: "sender", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
      limit: CONVERSATION_SNAPSHOT_SIZE,
    });
    return {
      reportedUserId: otherId,
      snapshot: {
        authorName: await authorName(otherId),
        messages: messages.reverse().map(message => ({
          senderName: (message as any).sender?.name || null,
          fromReported: message.senderId === otherId,
          content: message.content,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          createdAt: message.createdAt,
        })),
      },
    };
  }

  private async notifySupport(report: Report) {
    try {
      const support = await User.findOne({
        where: { isSupport: true },
        attributes: ["id"],
      });
      if (!support) return;
      await PushService.sendToUser(support.id, {
        title:
          report.reason === "child_safety"
            ? "Denúncia urgente: menores de idade"
            : "Nova denúncia",
        body: `${TARGET_LABEL[report.targetType]} · ${REASON_LABEL[report.reason]}`,
        url: "/denuncias",
        tag: `report-${report.id}`,
      });
    } catch (error) {
      console.error(
        "Erro ao avisar o suporte da denúncia:",
        (error as Error).message,
      );
    }
  }

  // Fila do suporte: abertas, mais recentes primeiro, com nome de quem
  // denunciou e de quem foi denunciado
  async listOpen() {
    const reports = await Report.findAll({
      where: { status: "open" },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    const userIds = [
      ...new Set(
        reports.flatMap(report =>
          [report.reporterId, report.reportedUserId].filter(
            (id): id is string => !!id,
          ),
        ),
      ),
    ];
    const users = userIds.length
      ? await User.findAll({
          where: { id: { [Op.in]: userIds } },
          attributes: ["id", "name", "avatarUrl"],
        })
      : [];
    const byId = new Map(users.map(user => [user.id, user]));

    return reports.map(report => ({
      ...report.toJSON(),
      reporter: byId.get(report.reporterId) || null,
      reportedUser: report.reportedUserId
        ? byId.get(report.reportedUserId) || null
        : null,
    }));
  }

  async countOpen() {
    return Report.count({ where: { status: "open" } });
  }

  async resolve(reportId: string, action: ResolveAction) {
    const report = await Report.findByPk(reportId);
    if (!report) throw new Error("Denúncia não encontrada");
    if (report.status !== "open") {
      throw new Error("Esta denúncia já foi resolvida");
    }

    if (action === "dismiss") {
      await report.update({
        status: "dismissed",
        resolution: "dismissed",
        resolvedAt: new Date(),
      });
      return { message: "Denúncia arquivada" };
    }

    if (action === "delete_account") {
      if (!report.reportedUserId) {
        throw new Error("A conta denunciada já não existe");
      }
      // A exclusão de conta apaga também as denúncias sobre ela
      await AccountService.deleteAccount(report.reportedUserId);
      return { message: "Conta excluída" };
    }

    if (action === "remove_content") {
      await this.removeTarget(report.targetType, report.targetId);
      // Outras denúncias abertas sobre o mesmo conteúdo saem da fila junto
      await Report.update(
        {
          status: "resolved",
          resolution: "content_removed",
          resolvedAt: new Date(),
        },
        {
          where: {
            targetType: report.targetType,
            targetId: report.targetId,
            status: "open",
          },
        },
      );
      return { message: "Conteúdo removido" };
    }

    throw new Error("Ação inválida");
  }

  // Remoção pelo suporte, sem checar o dono. A mídia sai do Cloudinary
  // também: conteúdo ilegal não pode continuar acessível pela URL.
  private async removeTarget(targetType: ReportTargetType, targetId: string) {
    if (targetType === "post") {
      const post = await Post.findByPk(targetId);
      if (!post) return; // o autor já apagou
      const comments = await Comment.findAll({
        where: { postId: post.id },
        attributes: ["id"],
      });
      const commentIds = comments.map(comment => comment.id);
      await sequelize.transaction(async transaction => {
        await CommentLike.destroy({
          where: { commentId: { [Op.in]: commentIds } },
          transaction,
        });
        await Comment.destroy({ where: { postId: post.id }, transaction });
        await Like.destroy({ where: { postId: post.id }, transaction });
        await Notification.destroy({
          where: { postId: post.id },
          transaction,
        });
        await post.destroy({ transaction });
      });
      for (const url of [post.imageUrl, post.videoUrl]) {
        const parsed = publicIdFromUrl(url);
        if (parsed) {
          await deleteCloudinaryFile(parsed.publicId, parsed.resourceType);
        }
      }
      return;
    }

    if (targetType === "comment") {
      const comment = await Comment.findByPk(targetId);
      if (!comment) return;
      // Mesma regra do CommentService.delete: as respostas saem junto
      const replies = await Comment.findAll({
        where: { parentId: comment.id },
        attributes: ["id"],
      });
      const ids = [comment.id, ...replies.map(reply => reply.id)];
      await sequelize.transaction(async transaction => {
        await CommentLike.destroy({
          where: { commentId: { [Op.in]: ids } },
          transaction,
        });
        await Comment.destroy({
          where: { id: { [Op.in]: ids } },
          transaction,
        });
      });
      return;
    }

    if (targetType === "work") {
      await Work.destroy({ where: { id: targetId } });
      return;
    }

    throw new Error(
      "Perfis e conversas não têm conteúdo para remover: use excluir conta ou arquivar",
    );
  }
}

export default new ReportService();
