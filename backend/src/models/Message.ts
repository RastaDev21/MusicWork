import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Message extends Model {
  declare id: string;
  declare conversationId: string;
  declare senderId: string;
  declare content: string | null;
  declare imageUrl: string | null;
  declare videoUrl: string | null;
  declare read: boolean;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
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
    modelName: "Message",
    tableName: "messages",
  },
);

export default Message;
