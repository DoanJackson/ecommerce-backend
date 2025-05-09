import sequelize from "../config/database.js";
import setupAssociations from "./associations.js";
import Goods from "./Goods.js";
import Goods_Types from "./Goods_Types.js";
import Images from "./Images.js";
import Orders from "./Orders.js";
import RefreshToken from "./RefreshToken.js";
import Types from "./Types.js";
import Users from "./Users.js";

setupAssociations();

export {
  Goods,
  Goods_Types,
  Images,
  Orders,
  RefreshToken,
  sequelize,
  Types,
  Users,
};
