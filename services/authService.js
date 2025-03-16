import bcrypt from "bcrypt";
import Client from "../models/Client.js";
import { RefreshToken, sequelize, Users } from "../models/index.js";
import { isValidPassword } from "../utils/auth.js";
import ResponseWrapper from "../utils/response.js";
import {
  generateAccessToken,
  generateRefreshToken,
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

    // Create a client
    await Client.create(
      {
        id: user.id,
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

export { loginService, registerService };
