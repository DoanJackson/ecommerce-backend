import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ["client"],
      validate: {
        isIn: [["client", "merchant"]],
      },
    },
    google_id: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tel_phone: {
      type: DataTypes.STRING(15),
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
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
    name_shop: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  { tableName: "users", timestamps: false }
);

export default Users;
