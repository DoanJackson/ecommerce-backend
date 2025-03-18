import jwt from "jsonwebtoken";
import { getEnv } from "../config/env.js";

const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
const ACCESS_TOKEN_EXPIRES_IN = getEnv("ACCESS_TOKEN_EXPIRES_IN");
const REFRESH_TOKEN_EXPIRES_IN = getEnv("REFRESH_TOKEN_EXPIRES_IN");

/**
 * @param {Object} user - user information (id, role)
 * @returns {string}
 */
function generateAccessToken(user) {
  return jwt.sign({ id: user.id, roles: user.roles }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
}

/**
 * @param {Object} user - user information (id)
 * @returns {string}
 */
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
}

/**
 * @param {string} token
 * @param {string} secret
 * @returns {import("jsonwebtoken").JwtPayload}
 */
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

export { generateAccessToken, generateRefreshToken, verifyToken };
