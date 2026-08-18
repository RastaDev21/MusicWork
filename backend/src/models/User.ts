import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class User extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare instrument: string;
  declare secondaryInstruments: string[];
  declare secondaryProfession: string;
  declare city: string;
  declare bio: string;
  declare avatarUrl: string | null;
  declare coverUrl: string | null;
  declare presentationVideoUrl: string | null;
  declare genre: string;
  declare secondaryGenres: string[];
  declare nationality: string | null;
  declare instagram: string | null;
  declare youtube: string | null;
  declare spotify: string | null;
  declare favoriteSongUrl: string | null;
  declare isProfessor: boolean;
  declare profileAudioUrl: string | null;
  declare facebook: string | null;
  declare tiktok: string | null;
  declare resetPasswordToken: string | null;
  declare resetPasswordExpires: Date | null;
  declare isSupport: boolean;
  declare isEmailVerified: boolean;
  declare emailVerificationToken: string | null;
  declare emailVerificationExpires: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryInstruments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    secondaryProfession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presentationVideoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryGenres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtube: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spotify: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    favoriteSongUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isProfessor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tiktok: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    profileAudioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isSupport: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  },
);

export default User;
