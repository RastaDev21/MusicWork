import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

// Inscrição de push de um aparelho/navegador. Um usuário pode ter várias
// (celular, computador). O endpoint é único: se outra conta logar no mesmo
// aparelho, a inscrição passa para ela.
class PushSubscription extends Model {
  declare id: string;
  declare userId: string;
  declare endpoint: string;
  declare p256dh: string;
  declare auth: string;
}

PushSubscription.init(
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
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PushSubscription",
    tableName: "push_subscriptions",
    // Índice nomeado em vez de `unique: true` na coluna: com
    // sync({ alter: true }), o `unique` da coluna cria uma constraint nova a
    // cada restart. Índice com nome o sync reconhece e não recria.
    indexes: [
      {
        name: "push_subscriptions_endpoint_unique",
        unique: true,
        fields: ["endpoint"],
      },
    ],
  },
);

export default PushSubscription;
