import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export type ReportTargetType =
  | "post"
  | "comment"
  | "user"
  | "work"
  | "conversation";

export type ReportStatus = "open" | "resolved" | "dismissed";

// Denúncia feita dentro do app (exigência da política de conteúdo gerado por
// usuários do Play). `snapshot` guarda uma cópia do que foi denunciado no
// momento da denúncia, para o suporte ver mesmo se o autor editar ou apagar.
class Report extends Model {
  declare id: string;
  declare reporterId: string;
  declare targetType: ReportTargetType;
  declare targetId: string;
  declare reportedUserId: string | null;
  declare reason: string;
  declare details: string | null;
  declare snapshot: Record<string, unknown> | null;
  declare status: ReportStatus;
  declare resolution: string | null;
  declare resolvedAt: Date | null;
  declare createdAt: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reportedUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    snapshot: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    resolution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
  },
);

export default Report;
