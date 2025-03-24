import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Types = sequelize.define(
  "types",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
  },
  { tableName: "types", timestamps: false }
);

export default Types;
