import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import sequelize from "../config/database.js";
import ERROR_CODES from "../constants/errorCodes.js";
import Client from "../models/Client.js";
import RefreshToken from "../models/RefreshToken.js";
import Users from "../models/User.js";
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
 * @returns {Promise<ResponseWrapper>}
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

    return ResponseWrapper.success(
      StatusCodes.CREATED,
      "User created successfully",
      {
        accessToken: access_token,
        refreshToken: refresh_token,
        user: _.pick(user, ["id", "username", "role"]),
      }
    );
  } catch (error) {
    await t.rollback();
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

    return ResponseWrapper.success(StatusCodes.OK, "Login successful", {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: _.pick(user, ["id", "username", "role"]),
    });
  } catch (error) {
    await t.rollback();
    switch (error.message) {
      case "USER_NOT_FOUND":
        return { success: false, error_codes: ERROR_CODES.USER_NOT_FOUND };
      case "UNAUTHORIZED":
        return { success: false, error_codes: ERROR_CODES.UNAUTHORIZED };
      default:
        return {
          success: false,
          error_codes: ERROR_CODES.INTERNAL_SERVER_ERROR,
        };
    }
  }
}

export { loginService, registerService };
