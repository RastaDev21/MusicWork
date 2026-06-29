import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Comment extends Model {
  declare id: string;
  declare content: string;
  declare userId: string;
  declare postId: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
  },
);

export default Comment;
