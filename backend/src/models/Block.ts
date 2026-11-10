import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

// blockerId bloqueou blockedId. O efeito vale para os dois lados: nenhum
// segue, manda mensagem ou vê as publicações do outro (ver BlockService).
class Block extends Model {
  declare id: string;
  declare blockerId: string;
  declare blockedId: string;
  declare createdAt: Date;
}

Block.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blockerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    blockedId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Block",
    tableName: "blocks",
    // Índice nomeado em vez de `unique: true` (ver PushSubscription)
    indexes: [
      {
        name: "blocks_blocker_blocked_unique",
        unique: true,
        fields: ["blockerId", "blockedId"],
      },
    ],
  },
);

export default Block;
