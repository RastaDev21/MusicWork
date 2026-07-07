import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Post extends Model {
  declare id: string;
  declare content: string;
  declare userId: string;
  declare videoUrl: string | null;
  declare imageUrl: string | null;
  declare isPinned: boolean;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
  },
);

export default Post;
