import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import sequelize from "../config/database.js";
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function register(req, res) {
  const t = await sequelize.transaction();

  try {
    const { username, password, role } = req.body;

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

    // save refresh token in the database
    await RefreshToken.create(
      {
        user_id: user.id,
        token: refresh_token,
        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      { transaction: t }
    );

    // Commit the transaction
    await t.commit();

    // Send the response
    res.json(
      ResponseWrapper.success(StatusCodes.OK, "User created successfully", {
        accessToken: access_token,
        refreshToken: refresh_token,
        user: _.pick(user, ["id", "username", "role"]),
      })
    );
  } catch (error) {
    // Rollback the transaction
    await t.rollback();
    console.error(error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await Users.findOne({
      where: {
        username: username,
      },
    });

    // If user not found
    if (!user) return sendErrorResponse(res, ERROR_CODES.USER_NOT_FOUND);

    // If password is invalid
    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) return sendErrorResponse(res, ERROR_CODES.UNAUTHORIZED);

    // Generate access token and refresh token
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    // Save refresh token in the database
    await RefreshToken.create({
      user_id: user.id,
      token: refresh_token,
      expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    // Send the response
    res.status(StatusCodes.OK).json(
      ResponseWrapper.success(StatusCodes.OK, "Login successful", {
        accessToken: access_token,
        refreshToken: refresh_token,
        user: _.pick(user, ["id", "username", "role"]),
      })
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
export { login, register };
