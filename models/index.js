import sequelize from "../config/database.js";
import RefreshToken from "./RefreshToken.js";
import Users from "./User.js";
import setupAssociations from "./associations.js";

setupAssociations();

export { RefreshToken, sequelize, Users };
