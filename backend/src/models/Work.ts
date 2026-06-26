import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Work extends Model {
  declare id: string;
  declare userId: string;
  declare type: "offer" | "request";
  declare title: string;
  declare description: string;
  declare price: string;
  declare city: string;
  declare category: string;
  declare subcategory: string;
  declare contact: string;
}

Work.init(
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
    type: {
      type: DataTypes.ENUM("offer", "request"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Work",
    tableName: "works",
  },
);

export default Work;
