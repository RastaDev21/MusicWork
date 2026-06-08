import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Like extends Model {
  declare id: string;
  declare userId: string;
  declare postId: string;
}

Like.init(
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
  },
);

export default Like;
