import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Goods from "./Goods.js";
import Types from "./Types.js";

const Goods_Types = sequelize.define(
  "goods_types",
  {
    goods_id: {
      type: DataTypes.UUID,
      references: { model: Goods, key: "id" },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    type_id: {
      type: DataTypes.UUID,
      references: { model: Types, key: "id" },
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  { tableName: "goods_types", timestamps: false }
);

export default Goods_Types;
