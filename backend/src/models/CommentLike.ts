import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class CommentLike extends Model {
  declare id: string;
  declare userId: string;
  declare commentId: string;
}

CommentLike.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CommentLike",
    tableName: "comment_likes",
  },
);

export default CommentLike;
