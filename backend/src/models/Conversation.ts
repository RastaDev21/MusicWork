import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Conversation extends Model {
  declare id: string;
  declare user1Id: string;
  declare user2Id: string;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
  },
);

export default Conversation;
