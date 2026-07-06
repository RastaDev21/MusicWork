import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Notification extends Model {
  declare id: string;
  declare recipientId: string;
  declare senderId: string;
  declare type: "follow" | "like" | "comment" | "reply" | "comment_like";
  declare postId: string | null;
  declare read: boolean;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
  },
);

export default Notification;
