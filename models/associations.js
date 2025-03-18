import RefreshToken from "./RefreshToken.js";
import Users from "./Users.js";

function setupAssociations() {
  Users.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
  RefreshToken.belongsTo(Users, { foreignKey: "user_id", as: "user" });
}

export default setupAssociations;
