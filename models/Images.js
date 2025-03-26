import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Goods from "./Goods.js";
import Users from "./Users.js";
// -- Create images table
// CREATE TABLE images(
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     public_id VARCHAR(255) UNIQUE NOT NULL,
//     secure_url TEXT UNIQUE NOT NULL,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     goods_id UUID REFERENCES goods(id) ON DELETE CASCADE,
//     CONSTRAINT check_image_ownership CHECK(
//         (user_id IS NOT NULL AND goods_id IS NULL) OR
//         (user_id IS NULL AND goods_id IS NOT NULL)
//     )
// )

const Images = sequelize.define(
  "images",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    public_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    secure_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
      },
    },
    goods_id: {
      type: DataTypes.UUID,
      references: {
        model: Goods,
        key: "id",
      },
    },
  },
  {
    tableName: "images",
    timestamps: false,
    validate: {
      checkImageOwnership() {
        if (
          (this.user_id && this.goods_id) ||
          (!this.user_id && !this.goods_id)
        ) {
          throw new Error("An image must belong to either a user or a goods");
        }
      },
    },
  }
);

export default Images;
