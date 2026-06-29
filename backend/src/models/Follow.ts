import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Follow extends Model {
  declare id: string;
  declare followerId: string;
  declare followingId: string;
}

Follow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Follow",
    tableName: "follows",
  },
);

export default Follow;
