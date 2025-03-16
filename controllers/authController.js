import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import sequelize from "../config/database.js";
import ERROR_CODES from "../constants/errorCodes.js";
import Client from "../models/Client.js";
import RefreshToken from "../models/RefreshToken.js";
import Users from "../models/User.js";
import ResponseWrapper from "../utils/response.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

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

    // Generate access token
    const access_token = generateAccessToken(user);
    // Generate refresh token
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
    // Send the error response
    const error_code = ERROR_CODES.USER_EXISTS;
    res.status(error_code.status).json(ResponseWrapper.error(error_code));
  }
}
export { register };
