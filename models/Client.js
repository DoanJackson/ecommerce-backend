import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Users from "./User.js";

const Client = sequelize.define(
  "client",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Users,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role_client: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "normal",
      validate: {
        isIn: [["normal", "merchant"]],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "unbanned",
      validate: {
        isIn: [["banned", "unbanned"]],
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    tel_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
  },
  { tableName: "client", timestamps: false }
);

export default Client;
