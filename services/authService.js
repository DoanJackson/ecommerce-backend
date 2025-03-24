import bcrypt from "bcrypt";
import { getEnv } from "../config/env.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { RefreshToken, sequelize, Users } from "../models/index.js";
import { isValidPassword } from "../utils/auth.js";
import ResponseWrapper from "../utils/response.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/tokenUtils.js";

/**
 * @param {string} username
 * @param {string} password
 * @param {string} role
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
async function registerService(username, password, role) {
  const t = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a user
    const user = await Users.create(
      {
        username,
        password: hashedPassword,
        role,
      },
      { transaction: t }
    );

    // Generate access token and refresh token
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    // Save refresh token in the database
    await RefreshToken.create(
      {
        user_id: user.id,
        token: refresh_token,
        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      { transaction: t }
    );

    await t.commit();

    return { accessToken: access_token, refreshToken: refresh_token };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<ResponseWrapper>}
 */
async function loginService(username, password) {
  const t = await sequelize.transaction();
  try {
    // Find the user
    const user = await Users.findOne({
      where: {
        username: username,
      },
    });

    // If user not found
    if (!user) throw new Error("USER_NOT_FOUND");

    // If password is invalid
    const isValid = await isValidPassword(password, user.password);
    if (!isValid) throw new Error("UNAUTHORIZED");

    // Generate access token and refresh token
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    // Save refresh token in the database
    await RefreshToken.create(
      {
        user_id: user.id,
        token: refresh_token,
        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      { transaction: t }
    );

    await t.commit();

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

/**
 * @param {string} refreshToken
 * @returns {Promise<{success: boolean, accessToken?: string, error_code?: string}>}
 */
async function refreshTokenService(refreshToken) {
  try {
    const decoded = verifyToken(refreshToken, getEnv("JWT_REFRESH_SECRET"));

    const storedToken = await RefreshToken.findOne({
      where: { user_id: decoded.id, token: refreshToken },
    });
    if (!storedToken || storedToken.expired_at < new Date()) {
      return { success: false, error_code: ERROR_CODES.INVALID_REFRESH_TOKEN };
    }

    const user = await Users.findByPk(decoded.id);
    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });
    return { success: true, accessToken: newAccessToken };
  } catch (err) {
    return { success: false, error_code: ERROR_CODES.INVALID_REFRESH_TOKEN };
  }
}

/**
 * @param {string} refreshToken
 */
async function logoutService(refreshToken) {
  try {
    await RefreshToken.destroy({ where: { token: refreshToken } });
  } catch (error) {
    console.error(error);
  }
}

export { loginService, logoutService, refreshTokenService, registerService };
