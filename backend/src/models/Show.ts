import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Show extends Model {
  declare id: string;
  declare userId: string;
  declare title: string;
  declare dateTime: Date;
  declare city: string;
  declare genre: string;
  declare venue: string | null;
  declare description: string | null;
}

Show.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Show",
    tableName: "shows",
  },
);

export default Show;
