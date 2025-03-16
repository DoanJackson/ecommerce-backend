import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "../constants/errorCodes.js";
import Client from "../models/Client.js";
import RefreshToken from "../models/RefreshToken.js";
import Users from "../models/User.js";
import { sendErrorResponse } from "../utils/errorHandlers.js";
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
  // Find the user
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  // If user not found
  if (!user) throw sendErrorResponse(res, ERROR_CODES.USER_NOT_FOUND);

  // If password is invalid
  const isValid = bcrypt.compare(password, user.password);
  if (!isValid) throw sendErrorResponse(res, ERROR_CODES.UNAUTHORIZED);

  // Generate access token and refresh token
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user);

  // Save refresh token in the database
  await RefreshToken.create({
    user_id: user.id,
    token: refresh_token,
    expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  return ResponseWrapper.success(StatusCodes.OK, "Login successful", {
    accessToken: access_token,
    refreshToken: refresh_token,
    user: _.pick(user, ["id", "username", "role"]),
  });
}

export { loginService, registerService };
