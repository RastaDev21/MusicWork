import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Post extends Model {
  declare id: string;
  declare content: string;
  declare userId: string;
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
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
  },
);

export default Post;
