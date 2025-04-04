import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Goods from "./Goods.js";
import Users from "./Users.js";

// -- Create orders table
// CREATE TABLE orders(
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     goods_id UUID REFERENCES goods(id) ON DELETE CASCADE,
//     quantity INTEGER NOT NULL CHECK (quantity > 0),
//     total_price numeric(15,2) NOT NULL CHECK (total_price >= 0),
//     status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'canceled')),
//     created_at TIMESTAMPTZ DEFAULT NOW(),
//     city varchar(100) NOT NULL,
//     district varchar(100) NOT NULL,
//     address varchar(100) NOT NULL
// )
const Orders = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    goods_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Goods,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "canceled"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { tableName: "orders", timestamps: false }
);

export default Orders;
