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
    google_id: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
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
    role: {
      type: DataTypes.STRING(20),
      defaultValue: "user",
      allowNull: false,
      validate: {
        isIn: [["user", "admin"]],
      },
    },
  },
  { tableName: "users", timestamps: false }
);

export default Users;
