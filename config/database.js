import { Sequelize } from "sequelize";
import { getEnv } from "./env.js";

const dbConfig = Object.freeze({
  HOST: getEnv("DB_HOST"),
  DB: getEnv("DB_NAME"),
  USER: getEnv("DB_USER"),
  PASSWORD: getEnv("DB_PASSWORD"),
  PORT: getEnv("DB_PORT"),
  dialect: getEnv("DB_DIALECT"),
});

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}

export default sequelize;
