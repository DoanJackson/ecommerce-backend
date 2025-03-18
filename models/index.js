import sequelize from "../config/database.js";
import setupAssociations from "./associations.js";
import RefreshToken from "./RefreshToken.js";
import Users from "./Users.js";

setupAssociations();

export { RefreshToken, sequelize, Users };
