import Goods from "./Goods.js";
import Goods_Types from "./Goods_Types.js";
import Images from "./Images.js";
import Orders from "./Orders.js";
import RefreshToken from "./RefreshToken.js";
import Types from "./Types.js";
import Users from "./Users.js";

function setupAssociations() {
  Users.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
  RefreshToken.belongsTo(Users, { foreignKey: "user_id", as: "user" });
  Users.hasMany(Goods, { foreignKey: "user_id", as: "goods" });
  Goods.belongsTo(Users, { foreignKey: "user_id", as: "merchant" });
  Goods.belongsToMany(Types, {
    through: Goods_Types,
    foreignKey: "goods_id",
    as: "types",
  });
  Types.belongsToMany(Goods, {
    through: Goods_Types,
    foreignKey: "type_id",
    as: "goods",
  });
  Goods.hasMany(Images, { foreignKey: "goods_id", as: "images" });
  Images.belongsTo(Goods, { foreignKey: "goods_id", as: "goods" });
  Users.hasOne(Images, {
    foreignKey: "user_id",
    as: "images",
    onDelete: "CASCADE",
  });
  Images.belongsTo(Users, { foreignKey: "user_id", as: "user" });
  Users.hasMany(Orders, {
    foreignKey: "user_id",
    as: "orders",
    onDelete: "CASCADE",
  });
  Orders.belongsTo(Users, { foreignKey: "user_id", as: "user" });
  Goods.hasMany(Orders, {
    foreignKey: "goods_id",
    as: "orders",
    onDelete: "CASCADE",
  });
  Orders.belongsTo(Goods, { foreignKey: "goods_id", as: "goods" });
}

export default setupAssociations;
