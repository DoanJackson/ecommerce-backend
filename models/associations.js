import Goods from "./Goods.js";
import Goods_Types from "./Goods_Types.js";
import RefreshToken from "./RefreshToken.js";
import Types from "./Types.js";
import Users from "./Users.js";

function setupAssociations() {
  Users.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
  RefreshToken.belongsTo(Users, { foreignKey: "user_id", as: "user" });
  Users.hasMany(Goods, { foreignKey: "user_id", as: "goods" });
  Goods.belongsTo(Users, { foreignKey: "user_id", as: "user" });
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
}

export default setupAssociations;
